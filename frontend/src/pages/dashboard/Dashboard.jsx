import { useEffect, useState } from "react";
import { toast } from "sonner";

import useWorkspaceStore from "../../store/workspaceStore";
import { getDashboard } from "../../api/dashboardApi";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const { currentOrganization } =
    useWorkspaceStore();

  const [loading, setLoading] =
    useState(true);
  const navigate = useNavigate();

  const [stats, setStats] =
    useState(null);

  useEffect(() => {
    if (currentOrganization) {
      loadDashboard();
    }
  }, [currentOrganization]);

  async function loadDashboard() {
    try {
      setLoading(true);

      const data = await getDashboard(
        currentOrganization.id
      );

      setStats(data);
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!currentOrganization) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center">
        <h2 className="text-2xl font-bold">
          No Organization Selected
        </h2>

        <p className="text-gray-500 mt-2">
          Please open an organization first.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          {currentOrganization.name}
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <DashboardCard
          title="Projects"
          value={stats?.totalProjects ?? 0}
          color="bg-indigo-600"
        />

        <DashboardCard
          title="Members"
          value={stats?.totalMembers ?? 0}
          color="bg-blue-600"
        />

        <DashboardCard
          title="Tasks"
          value={stats?.totalTasks ?? 0}
          color="bg-green-600"
        />

        <DashboardCard
          title="Completed"
          value={stats?.doneTasks ?? 0}
          color="bg-emerald-600"
        />

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mt-8">

        <DashboardCard
          title="Todo"
          value={stats?.todoTasks ?? 0}
          color="bg-red-500"
        />

        <DashboardCard
          title="In Progress"
          value={stats?.inProgressTasks ?? 0}
          color="bg-yellow-500"
        />

        <DashboardCard
          title="In Review"
          value={stats?.inReviewTasks ?? 0}
          color="bg-purple-600"
        />

        <DashboardCard
          title="Done"
          value={stats?.doneTasks ?? 0}
          color="bg-teal-600"
        />

      </div>

    </div>
  );
}