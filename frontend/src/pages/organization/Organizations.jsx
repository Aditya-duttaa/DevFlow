import { useEffect, useState } from "react";
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

  const setCurrentOrganization = useWorkspaceStore(
    (state) => state.setCurrentOrganization
  );
  const setCurrentMember = useWorkspaceStore(
    (state) => state.setCurrentMember
  );

  const user = useAuthStore((state) => state.user);

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrganizations() {
    try {
      setLoading(true);

      const data = await getOrganizations();

      setOrganizations(data);
    } catch {
      toast.error("Failed to load organizations");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadOrganizations();
  }, []);

  async function create(data) {
    try {
      const organization = await createOrganization(data);

      toast.success("Organization created");

      setOrganizations((prev) => [
        organization,
        ...prev,
      ]);
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Creation failed"
      );
    }
  }

  async function openOrganization(org) {
    try {
      const fullOrg = await getOrganization(org.id);

      const member =
        fullOrg.members.find(
          (m) => m.userId === user?.id
        ) || null;

      setCurrentOrganization(fullOrg);
      setCurrentMember(member);

      toast.success(
        `${fullOrg.name} selected`
      );
      navigate("/");
    } catch {
      toast.error(
        "Failed to open organization"
      );
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Organizations
        </h1>

        <p className="text-gray-500">
          Create and manage workspaces
        </p>
      </div>

      <CreateOrganizationModal
        onCreate={create}
      />

      {loading ? (
        <h2>Loading...</h2>
      ) : organizations.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-2xl font-bold">
            No Organizations
          </h2>

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
