import api from "./axios";

export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data.data;
};

export const markNotificationRead = async (
  notificationId
) => {
  const res = await api.patch(
    `/notifications/${notificationId}/read`
  );

  return res.data.data;
};