import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getNotifications,
  markNotificationRead,
} from "../../api/notificationApi";

export default function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  async function loadNotifications() {
    setLoading(true);

    try {
      const data =
        await getNotifications();

      setNotifications(data);
    } catch {
      toast.error(
        "Failed to load notifications"
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function markRead(id) {
    try {
      await markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                isRead: true,
              }
            : n
        )
      );

      toast.success(
        "Notification marked as read"
      );
    } catch {
      toast.error(
        "Failed to update notification"
      );
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading...
      </div>
    );
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Notifications
      </h1>

      <div className="space-y-5">

        {notifications.length === 0 && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            No Notifications
          </div>
        )}

        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-xl shadow p-6 border-l-4 ${
              notification.isRead
                ? "bg-gray-50 border-gray-300"
                : "bg-white border-indigo-600"
            }`}
          >

            <div className="flex justify-between">

              <div>

                <h2 className="font-bold text-lg">
                  {notification.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  {notification.message}
                </p>

                <p className="text-xs text-gray-400 mt-4">
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </p>

              </div>

              {!notification.isRead && (
                <button
                  onClick={() =>
                    markRead(
                      notification.id
                    )
                  }
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg h-fit"
                >
                  Mark Read
                </button>
              )}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}