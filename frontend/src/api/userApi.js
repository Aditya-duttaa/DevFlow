import api from "./axios";

export const searchUsers = async (query) => {
  const res = await api.get("/users/search", {
    params: { q: query },
  });

  return res.data.data ?? res.data;
};
