import api from "./axios";

export const getComments = async (taskId) => {
  const res = await api.get(`/comments/task/${taskId}`);
  return res.data.data;
};

export const createComment = async (data) => {
  const res = await api.post("/comments", data);
  return res.data.data;
};

export const updateComment = async (id, content) => {
  const res = await api.patch(`/comments/${id}`, {
    content,
  });

  return res.data.data;
};

export const deleteComment = async (id) => {
  await api.delete(`/comments/${id}`);
};