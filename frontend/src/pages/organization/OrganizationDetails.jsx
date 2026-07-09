import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import useWorkspaceStore from "../../store/workspaceStore";
import UserSearchPicker from "../../components/user/UserSearchPicker";
import {
  getOrganization,
  updateOrganization,
  inviteMember,
  removeMember,
  changeMemberRole,
} from "../../api/organizationApi";

export default function OrganizationDetails() {
  const queryClient = useQueryClient();
  const {
    currentOrganization,
    currentMember,
    setCurrentOrganization,
    setCurrentMember,
  } = useWorkspaceStore();
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });
  const [inviteForm, setInviteForm] = useState({
    selectedUser: null,
    role: "DEVELOPER",
  });

  const organizationKey = ["organization", currentOrganization?.id];

  const organizationQuery = useQuery({
    queryKey: organizationKey,
    queryFn: () => getOrganization(currentOrganization.id),
    enabled: !!currentOrganization?.id,
  });

  const organization = organizationQuery.data;

  useEffect(() => {
    if (!organization) return;

    setCurrentOrganization(organization);
    setEditForm({
      name: organization.name,
      description: organization.description || "",
    });

    const refreshedMember =
      organization.members.find(
        (member) => member.id === currentMember?.id
      ) || currentMember;

    if (refreshedMember) setCurrentMember(refreshedMember);
  }, [
    currentMember,
    currentMember?.id,
    organization,
    setCurrentMember,
    setCurrentOrganization,
  ]);

  const updateMutation = useMutation({
    mutationFn: (data) => updateOrganization(organization.id, data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: organizationKey });
      const previous = queryClient.getQueryData(organizationKey);
      queryClient.setQueryData(organizationKey, (current) => ({
        ...current,
        ...data,
      }));
      return { previous };
    },
    onError: (e, data, context) => {
      queryClient.setQueryData(organizationKey, context?.previous);
      toast.error(e.response?.data?.message || "Update failed");
    },
    onSuccess: () => toast.success("Organization updated"),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: organizationKey }),
  });

  const inviteMutation = useMutation({
    mutationFn: (data) => inviteMember(organization.id, data),
    onError: (e) => {
      toast.error(
        e.response?.data?.message || "Failed to invite member"
      );
    },
    onSuccess: () => {
      setInviteForm({ selectedUser: null, role: "DEVELOPER" });
      toast.success("Member added");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: organizationKey }),
  });

  const removeMutation = useMutation({
    mutationFn: (memberId) => removeMember(organization.id, memberId),
    onMutate: async (memberId) => {
      await queryClient.cancelQueries({ queryKey: organizationKey });
      const previous = queryClient.getQueryData(organizationKey);
      queryClient.setQueryData(organizationKey, (current) => ({
        ...current,
        members: current.members.filter(
          (member) => member.id !== memberId
        ),
      }));
      return { previous };
    },
    onError: (e, memberId, context) => {
      queryClient.setQueryData(organizationKey, context?.previous);
      toast.error(
        e.response?.data?.message || "Failed to remove member"
      );
    },
    onSuccess: () => toast.success("Member removed"),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: organizationKey }),
  });

  const roleMutation = useMutation({
    mutationFn: ({ memberId, role }) =>
      changeMemberRole(organization.id, memberId, role),
    onMutate: async ({ memberId, role }) => {
      await queryClient.cancelQueries({ queryKey: organizationKey });
      const previous = queryClient.getQueryData(organizationKey);
      queryClient.setQueryData(organizationKey, (current) => ({
        ...current,
        members: current.members.map((member) =>
          member.id === memberId ? { ...member, role } : member
        ),
      }));
      return { previous };
    },
    onError: (e, data, context) => {
      queryClient.setQueryData(organizationKey, context?.previous);
      toast.error(
        e.response?.data?.message || "Failed to update role"
      );
    },
    onSuccess: () => toast.success("Role updated"),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: organizationKey }),
  });

  function saveOrganization(e) {
    e.preventDefault();
    updateMutation.mutate(editForm);
  }

  function addMember(e) {
    e.preventDefault();

    if (!inviteForm.selectedUser) {
      toast.error("Select a user first");
      return;
    }

    inviteMutation.mutate({
      userId: inviteForm.selectedUser.id,
      role: inviteForm.role,
    });
  }

  if (!currentOrganization) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center">
        Select an organization first.
      </div>
    );
  }

  if (organizationQuery.isLoading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!organization) {
    return (
      <div className="text-center py-20">
        Organization not found.
      </div>
    );
  }

  const canManage =
    currentMember?.role === "OWNER" ||
    currentMember?.role === "ADMIN";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Organization Details
      </h1>

      {canManage && (
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
              setEditForm({ ...editForm, name: e.target.value })
            }
          />
          <textarea
            rows={3}
            className="border rounded-lg p-3 w-full mb-4"
            value={editForm.description}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                description: e.target.value,
              })
            }
          />
          <button className="bg-indigo-600 text-white px-5 py-3 rounded-lg">
            Save
          </button>
        </form>
      )}

      {canManage && (
        <form
          onSubmit={addMember}
          className="bg-white rounded-xl shadow p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">
            Invite Member
          </h2>
          <UserSearchPicker
            selectedUser={inviteForm.selectedUser}
            onSelect={(selectedUser) =>
              setInviteForm({ ...inviteForm, selectedUser })
            }
          />
          <select
            className="border rounded-lg p-3 w-full my-4"
            value={inviteForm.role}
            onChange={(e) =>
              setInviteForm({ ...inviteForm, role: e.target.value })
            }
          >
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
            <option value="DEVELOPER">DEVELOPER</option>
          </select>
          <button className="bg-green-600 text-white px-5 py-3 rounded-lg">
            Invite Member
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Members</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Name</th>
                <th className="text-left py-3">Email</th>
                <th className="text-left py-3">Role</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {organization.members.map((member) => (
                <tr key={member.id} className="border-b">
                  <td className="py-4">{member.user?.name}</td>
                  <td className="py-4">{member.user?.email}</td>
                  <td className="py-4">
                    {canManage ? (
                      <select
                        value={member.role}
                        onChange={(e) =>
                          roleMutation.mutate({
                            memberId: member.id,
                            role: e.target.value,
                          })
                        }
                        className="border rounded px-3 py-2"
                      >
                        <option value="OWNER">OWNER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="DEVELOPER">DEVELOPER</option>
                      </select>
                    ) : (
                      <span className="bg-gray-100 px-3 py-1 rounded">
                        {member.role}
                      </span>
                    )}
                  </td>
                  <td className="py-4">
                    {canManage && member.role !== "OWNER" && (
                      <button
                        onClick={() => {
                          if (window.confirm("Remove this member?")) {
                            removeMutation.mutate(member.id);
                          }
                        }}
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
