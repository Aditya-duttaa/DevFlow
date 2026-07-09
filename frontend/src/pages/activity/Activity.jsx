import { useQuery } from "@tanstack/react-query";

import useWorkspaceStore from "../../store/workspaceStore";
import { getActivities } from "../../api/activityApi";

export default function Activity() {
  const currentOrganization = useWorkspaceStore(
    (state) => state.currentOrganization
  );

  const activityQuery = useQuery({
    queryKey: ["activities", currentOrganization?.id],
    queryFn: () => getActivities(currentOrganization.id),
    enabled: !!currentOrganization?.id,
  });

  if (!currentOrganization) {
    return (
      <div className="text-center py-20">
        Select an organization first.
      </div>
    );
  }

  if (activityQuery.isLoading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  const activities = activityQuery.data ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Activity Feed</h1>

      {activities.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          No activity yet.
        </div>
      ) : (
        <div className="space-y-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl shadow p-6 border-l-4 border-indigo-600"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg">
                    {activity.action.replaceAll("_", " ")}
                  </h2>
                  <p className="mt-2 text-gray-600">
                    {activity.message}
                  </p>
                  {activity.actor && (
                    <p className="mt-3 text-sm text-gray-500">
                      By {activity.actor.user?.name ?? "Unknown"}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(activity.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
