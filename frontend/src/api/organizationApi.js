import api from "./axios";

export const createOrganization = async (data) => {
  const res = await api.post("/organizations", data);
  return res.data.data ?? res.data;
};

export const getOrganizations = async () => {
  const res = await api.get("/organizations");
  return res.data.data ?? res.data;
};

export const getOrganization = async (organizationId) => {
  const res = await api.get(`/organizations/${organizationId}`);
  return res.data.data ?? res.data;
};

export const updateOrganization = async (organizationId, data) => {
  const res = await api.patch(
    `/organizations/${organizationId}`,
    data
  );
  return res.data.data ?? res.data;
};

export const inviteMember = async (organizationId, data) => {
  const res = await api.post(
    `/organizations/${organizationId}/members`,
    data
  );
  return res.data.data ?? res.data;
};

export const removeMember = async (organizationId, memberId) => {
  const res = await api.delete(
    `/organizations/${organizationId}/members/${memberId}`
  );
  return res.data.data ?? res.data;
};

export const changeMemberRole = async (
  organizationId,
  memberId,
  role
) => {
  const res = await api.patch(
    `/organizations/${organizationId}/members/${memberId}/role`,
    { role }
  );
  return res.data.data ?? res.data;
};