import { useEffect, useState } from "react";
import { toast } from "sonner";

import useWorkspaceStore from "../../store/workspaceStore";
import { getDashboard } from "../../api/dashboardApi";

export default function Dashboard() {
  const { currentOrganization } = useWorkspaceStore();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    if (!currentOrganization) return;

    setLoading(true);

    try {
      const data = await getDashboard(
        currentOrganization.id
      );

      setDashboard(data);
    } catch {
      toast.error("Failed to load dashboard");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, [currentOrganization]);

  if (!currentOrganization) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center">
        <h2 className="text-2xl font-bold">
          No Organization Selected
        </h2>

        <p className="mt-3 text-gray-500">
          Please select an organization first.
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

  const cards = [
    {
      title: "Projects",
      value: dashboard.totalProjects,
    },
    {
      title: "Tasks",
      value: dashboard.totalTasks,
    },
    {
      title: "Members",
      value: dashboard.totalMembers,
    },
    {
      title: "Todo",
      value: dashboard.todoTasks,
    },
    {
      title: "In Progress",
      value: dashboard.inProgressTasks,
    },
    {
      title: "In Review",
      value: dashboard.inReviewTasks,
    },
    {
      title: "Done",
      value: dashboard.doneTasks,
    },
  ];

  return (
    <div>

      <h1 className="text-4xl font-bold mb-10">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow p-6"
          >
            <h2 className="text-gray-500">
              {card.title}
            </h2>

            <h1 className="text-4xl font-bold mt-4">
              {card.value}
            </h1>
          </div>
        ))}

      </div>

    </div>
  );
}