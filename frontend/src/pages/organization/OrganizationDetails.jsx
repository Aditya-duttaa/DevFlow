import { useEffect, useState } from "react";
import { toast } from "sonner";

import useWorkspaceStore from "../../store/workspaceStore";

import {
  getOrganization,
  updateOrganization,
  inviteMember,
  removeMember,
  changeMemberRole,
} from "../../api/organizationApi";

export default function OrganizationDetails() {
  const {
    currentOrganization,
    currentMember,
    setCurrentOrganization,
  } = useWorkspaceStore();

  const [organization, setOrganization] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [editForm, setEditForm] =
    useState({
      name: "",
      description: "",
    });

  const [inviteForm, setInviteForm] =
    useState({
      email: "",
      role: "DEVELOPER",
    });

  async function loadOrganization() {
    if (!currentOrganization?.id) return;

    try {
      setLoading(true);

      const data = await getOrganization(
        currentOrganization.id
      );

      setOrganization(data);

      setCurrentOrganization(data);

      setEditForm({
        name: data.name,
        description: data.description || "",
      });
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Failed to load organization"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrganization();
  }, [currentOrganization]);

  async function saveOrganization(e) {
    e.preventDefault();

    try {
      const updated =
        await updateOrganization(
          organization.id,
          editForm
        );

      setOrganization(updated);
      setCurrentOrganization(updated);

      toast.success(
        "Organization updated"
      );
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Update failed"
      );
    }
  }

  async function addMember(e) {
    e.preventDefault();

    try {
      await inviteMember(
        organization.id,
        inviteForm
      );

      toast.success(
        "Invitation sent"
      );

      setInviteForm({
        email: "",
        role: "DEVELOPER",
      });

      loadOrganization();
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Failed to invite member"
      );
    }
  }

  async function updateRole(
    memberId,
    role
  ) {
    try {
      await changeMemberRole(
        organization.id,
        memberId,
        role
      );

      toast.success(
        "Role updated"
      );

      loadOrganization();
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Failed to update role"
      );
    }
  }

  async function deleteMember(
    memberId
  ) {
    if (
      !window.confirm(
        "Remove this member?"
      )
    )
      return;

    try {
      await removeMember(
        organization.id,
        memberId
      );

      toast.success(
        "Member removed"
      );

      loadOrganization();
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Failed to remove member"
      );
    }
  }

  if (!currentOrganization) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center">
        Select an organization first.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading...
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="text-center py-20">
        Organization not found.
      </div>
    );
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Organization Details
      </h1>
            {(currentMember?.role === "OWNER" ||
        currentMember?.role === "ADMIN") && (

        <form
          onSubmit={saveOrganization}
          className="bg-white rounded-xl shadow p-6 mb-8"
        >

          <h2 className="text-xl font-semibold mb-4">
            Edit Organization
          </h2>

          <input
            className="border rounded-lg p-3 w-full mb-4"
            value={editForm.name}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                name: e.target.value,
              })
            }
          />

          <textarea
            rows={3}
            className="border rounded-lg p-3 w-full mb-4"
            value={editForm.description}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                description:
                  e.target.value,
              })
            }
          />

          <button className="bg-indigo-600 text-white px-5 py-3 rounded-lg">
            Save
          </button>

        </form>

      )}

      {(currentMember?.role === "OWNER" ||
        currentMember?.role === "ADMIN") && (

        <form
          onSubmit={addMember}
          className="bg-white rounded-xl shadow p-6 mb-8"
        >

          <h2 className="text-xl font-semibold mb-4">
            Invite Member
          </h2>

          <input
            className="border rounded-lg p-3 w-full mb-4"
            placeholder="Email"
            value={inviteForm.email}
            onChange={(e) =>
              setInviteForm({
                ...inviteForm,
                email: e.target.value,
              })
            }
          />

          <select
            className="border rounded-lg p-3 w-full mb-4"
            value={inviteForm.role}
            onChange={(e) =>
              setInviteForm({
                ...inviteForm,
                role: e.target.value,
              })
            }
          >

            <option value="ADMIN">
              ADMIN
            </option>

            <option value="MANAGER">
              MANAGER
            </option>

            <option value="DEVELOPER">
              DEVELOPER
            </option>

          </select>

          <button className="bg-green-600 text-white px-5 py-3 rounded-lg">
            Invite Member
          </button>

        </form>

      )}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-6">
          Members
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Name
                </th>

                <th className="text-left py-3">
                  Email
                </th>

                <th className="text-left py-3">
                  Role
                </th>

                <th className="text-left py-3">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>
                         {organization.members.map((member) => (

              <tr
                key={member.id}
                className="border-b"
              >

                <td className="py-4">
                  {member.user?.name}
                </td>

                <td className="py-4">
                  {member.user?.email}
                </td>

                <td className="py-4">

                  {(currentMember?.role === "OWNER" ||
                    currentMember?.role === "ADMIN") ? (

                    <select
                      value={member.role}
                      onChange={(e) =>
                        updateRole(
                          member.id,
                          e.target.value
                        )
                      }
                      className="border rounded px-3 py-2"
                    >

                      <option value="OWNER">
                        OWNER
                      </option>

                      <option value="ADMIN">
                        ADMIN
                      </option>

                      <option value="MANAGER">
                        MANAGER
                      </option>

                      <option value="DEVELOPER">
                        DEVELOPER
                      </option>

                    </select>

                  ) : (

                    <span className="bg-gray-100 px-3 py-1 rounded">
                      {member.role}
                    </span>

                  )}

                </td>

                <td className="py-4">

                  {(currentMember?.role === "OWNER" ||
                    currentMember?.role === "ADMIN") &&
                    member.role !== "OWNER" && (

                      <button
                        onClick={() =>
                          deleteMember(member.id)
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                      >
                        Remove
                      </button>

                  )}

                </td>

              </tr>

            ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
} 