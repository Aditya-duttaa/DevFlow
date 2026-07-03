import api from "./axios";

export const getDashboard = async (organizationId) => {
  const res = await api.get(
    `/dashboard/organization/${organizationId}`
  );

  return res.data.data ?? res.data;
};