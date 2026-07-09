import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import useAuthStore from "../../store/authStore";
import useWorkspaceStore from "../../store/workspaceStore";
import {
  createOrganization,
  getOrganizations,
  getOrganization,
} from "../../api/organizationApi";
import CreateOrganizationModal from "../../components/organization/CreateOrganizationModel";
import OrganizationCard from "../../components/organization/OrganizationCard";

export default function Organizations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setCurrentOrganization = useWorkspaceStore(
    (state) => state.setCurrentOrganization
  );
  const setCurrentMember = useWorkspaceStore(
    (state) => state.setCurrentMember
  );

  const organizationsQuery = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

  const createMutation = useMutation({
    mutationFn: createOrganization,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["organizations"] });
      const previous =
        queryClient.getQueryData(["organizations"]) ?? [];
      const optimistic = {
        id: `temp-${Date.now()}`,
        name: data.name,
        description: data.description,
        members: [],
      };

      queryClient.setQueryData(
        ["organizations"],
        [optimistic, ...previous]
      );

      return { previous };
    },
    onError: (e, data, context) => {
      queryClient.setQueryData(
        ["organizations"],
        context?.previous ?? []
      );
      toast.error(
        e.response?.data?.message || "Creation failed"
      );
    },
    onSuccess: () => toast.success("Organization created"),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["organizations"] }),
  });

  async function openOrganization(org) {
    if (org.id.startsWith?.("temp-")) return;

    try {
      const fullOrg = await getOrganization(org.id);
      const member =
        fullOrg.members.find((m) => m.userId === user?.id) ||
        null;

      setCurrentOrganization(fullOrg);
      setCurrentMember(member);
      queryClient.setQueryData(["organization", org.id], fullOrg);

      toast.success(`${fullOrg.name} selected`);
      navigate("/");
    } catch {
      toast.error("Failed to open organization");
    }
  }

  const organizations = organizationsQuery.data ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <p className="text-gray-500">
          Create and manage workspaces
        </p>
      </div>

      <CreateOrganizationModal
        onCreate={(data) => createMutation.mutate(data)}
      />

      {organizationsQuery.isLoading ? (
        <h2>Loading...</h2>
      ) : organizations.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-2xl font-bold">No Organizations</h2>
          <p className="text-gray-500 mt-3">
            Create your first organization.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {organizations.map((organization) => (
            <OrganizationCard
              key={organization.id}
              organization={organization}
              onOpen={openOrganization}
            />
          ))}
        </div>
      )}
    </div>
  );
}
