import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getNotifications,
  markNotificationRead,
} from "../../api/notificationApi";

export default function Notifications() {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previous =
        queryClient.getQueryData(["notifications"]) ?? [];

      queryClient.setQueryData(["notifications"], (current = []) =>
        current.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );

      return { previous };
    },
    onError: (e, id, context) => {
      queryClient.setQueryData(
        ["notifications"],
        context?.previous ?? []
      );
      toast.error("Failed");
    },
    onSuccess: () => {
      toast.success("Notification marked as read");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  if (notificationsQuery.isLoading) return <h2>Loading...</h2>;

  const notifications = notificationsQuery.data ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-2xl font-semibold">
            No Notifications
          </h2>
        </div>
      ) : (
        <div className="space-y-5">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl shadow p-5 bg-white border-l-4 ${
                notification.isRead
                  ? "border-gray-300"
                  : "border-indigo-600"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold text-lg">
                    {notification.title}
                  </h2>
                  <p className="mt-2 text-gray-600">
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-400 mt-3">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() =>
                      markReadMutation.mutate(notification.id)
                    }
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg h-fit"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
