import api from "./axios";

export const getActivities = async (
  organizationId
) => {
  const res = await api.get(
    `/activities/organization/${organizationId}`
  );

  return res.data.data;
};