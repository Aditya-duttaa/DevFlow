import api from "./axios";

export const getAttachments = async (taskId) => {
  const res = await api.get(`/attachments/task/${taskId}`);
  return res.data.data;
};

export const createAttachment = async (data) => {
  const res = await api.post("/attachments", data);
  return res.data.data;
};

export const deleteAttachment = async (id) => {
  await api.delete(`/attachments/${id}`);
};