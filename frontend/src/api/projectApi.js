import api from "./axios";

export const getProjects = async (organizationId) => {
  const res = await api.get("/projects", {
    params: {
      organizationId,
    },
  });

  return res.data.data;
};

export const getProject = async (projectId) => {
  const res = await api.get(`/projects/${projectId}`);
  return res.data.data;
};

export const createProject = async (data) => {
  const res = await api.post("/projects", data);
  return res.data.data;
};

export const updateProject = async (
  projectId,
  data
) => {
  const res = await api.patch(
    `/projects/${projectId}`,
    data
  );

  return res.data.data;
};

export const deleteProject = async (
  projectId
) => {
  await api.delete(`/projects/${projectId}`);
};