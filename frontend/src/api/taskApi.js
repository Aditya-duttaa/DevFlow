import api from "./axios";

export const getTasks = async (projectId) => {
  const res = await api.get("/tasks", {
    params: {
      projectId,
    },
  });

  return res.data.data;
};

export const getTask = async (taskId) => {
  const res = await api.get(`/tasks/${taskId}`);
  return res.data.data;
};

export const createTask = async (data) => {
  const res = await api.post("/tasks", data);
  return res.data.data;
};

export const updateTask = async (taskId, data) => {
  const res = await api.patch(`/tasks/${taskId}`, data);
  return res.data.data;
};

export const deleteTask = async (taskId) => {
  await api.delete(`/tasks/${taskId}`);
};

export const changeTaskStatus = async (
  taskId,
  status
) => {
  const res = await api.patch(
    `/tasks/${taskId}/status`,
    {
      status,
    }
  );

  return res.data.data;
};

export const assignTask = async (
  taskId,
  assigneeId
) => {
  const res = await api.patch(
    `/tasks/${taskId}/assign`,
    {
      assigneeId,
    }
  );

  return res.data.data;
};

export const unassignTask = async (taskId) => {
  const res = await api.patch(
    `/tasks/${taskId}/unassign`
  );

  return res.data.data;
};