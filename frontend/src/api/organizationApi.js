import api from "./axios";

// CREATE
export const createOrganization = async (data) => {
  const res = await api.post("/organizations", data);
  return res.data.data;
};

// GET ALL
export const getOrganizations = async () => {
  const res = await api.get("/organizations");
  return res.data.data;
};

// GET ONE
export const getOrganization = async (organizationId) => {
  const res = await api.get(`/organizations/${organizationId}`);
  return res.data.data;
};

// UPDATE
export const updateOrganization = async (organizationId, data) => {
  const res = await api.patch(
    `/organizations/${organizationId}`,
    data
  );
  return res.data.data;
};

// INVITE MEMBER
export const inviteMember = async (organizationId, data) => {
  const res = await api.post(
    `/organizations/${organizationId}/members`,
    data
  );
  return res.data.data;
};

// REMOVE MEMBER
export const removeMember = async (organizationId, memberId) => {
  const res = await api.delete(
    `/organizations/${organizationId}/members/${memberId}`
  );
  return res.data;
};

// CHANGE ROLE
export const changeMemberRole = async (
  organizationId,
  memberId,
  role
) => {
  const res = await api.patch(
    `/organizations/${organizationId}/members/${memberId}/role`,
    { role }
  );

  return res.data.data;
};