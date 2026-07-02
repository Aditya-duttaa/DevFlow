import { useEffect, useState } from "react";
import { toast } from "sonner";
import useWorkspaceStore from "../../store/workspaceStore";

import {
  getOrganization,
  inviteMember,
  updateMemberRole,
  removeMember,
} from "../../api/organizationApi";

const roles = [
  "ADMIN",
  "MANAGER",
  "DEVELOPER",
];

export default function OrganizationDetails() {
  const { currentOrganization } =
    useWorkspaceStore();

  const [organization, setOrganization] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [invite, setInvite] = useState({
    email: "",
    role: "DEVELOPER",
  });

  async function loadOrganization() {
    if (!currentOrganization) return;

    setLoading(true);

    try {
      const data =
        await getOrganization(
          currentOrganization.id
        );

      setOrganization(data);
    } catch {
      toast.error(
        "Failed to load organization"
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadOrganization();
  }, [currentOrganization]);

  async function addMember(e) {
    e.preventDefault();

    try {
      await inviteMember(
        currentOrganization.id,
        invite
      );

      toast.success(
        "Member invited"
      );

      setInvite({
        email: "",
        role: "DEVELOPER",
      });

      loadOrganization();
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Failed"
      );
    }
  }

  async function changeRole(
    memberId,
    role
  ) {
    try {
      await updateMemberRole(
        currentOrganization.id,
        memberId,
        role
      );

      toast.success(
        "Role Updated"
      );

      loadOrganization();
    } catch {
      toast.error(
        "Update Failed"
      );
    }
  }

  async function deleteMember(id) {
    if (
      !window.confirm(
        "Remove member?"
      )
    )
      return;

    try {
      await removeMember(
        currentOrganization.id,
        id
      );

      toast.success(
        "Member Removed"
      );

      loadOrganization();
    } catch {
      toast.error(
        "Delete Failed"
      );
    }
  }

  if (!currentOrganization)
    return (
      <div className="text-center py-20">
        Select an organization
      </div>
    );

  if (loading)
    return (
      <div className="text-center py-20">
        Loading...
      </div>
    );

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Organization Members
      </h1>

      <form
        onSubmit={addMember}
        className="bg-white rounded-xl shadow p-6 mb-8 grid md:grid-cols-3 gap-4"
      >

        <input
          className="border rounded-lg p-3"
          placeholder="Member Email"
          value={invite.email}
          onChange={(e) =>
            setInvite({
              ...invite,
              email: e.target.value,
            })
          }
        />

        <select
          className="border rounded-lg p-3"
          value={invite.role}
          onChange={(e) =>
            setInvite({
              ...invite,
              role: e.target.value,
            })
          }
        >
          {roles.map((role) => (
            <option
              key={role}
              value={role}
            >
              {role}
            </option>
          ))}
        </select>

        <button className="bg-indigo-600 text-white rounded-lg">
          Invite Member
        </button>

      </form>

      <div className="space-y-4">

        {organization.members.map(
          (member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
            >

              <div>

                <h2 className="font-semibold">
                  {member.user.name}
                </h2>

                <p className="text-gray-500">
                  {member.user.email}
                </p>

              </div>

              <div className="flex gap-3 items-center">

                <select
                  value={member.role}
                  onChange={(e) =>
                    changeRole(
                      member.id,
                      e.target.value
                    )
                  }
                  className="border rounded-lg p-2"
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

                {member.role !==
                  "OWNER" && (
                  <button
                    onClick={() =>
                      deleteMember(
                        member.id
                      )
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Remove
                  </button>
                )}

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}