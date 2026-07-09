import api from "./axios";

export const getAttachments = async (taskId) => {
  const res = await api.get(`/attachments/task/${taskId}`);
  return res.data.data;
};

export const createAttachment = async (data) => {
  const formData = new FormData();

  formData.append("taskId", data.taskId);
  formData.append("file", data.file);

  const res = await api.post("/attachments", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};

export const deleteAttachment = async (id) => {
  await api.delete(`/attachments/${id}`);
};
