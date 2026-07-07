import api from "./axios";

export const getPreferences = async () => {
  const res = await api.get("/preferences");
  return res.data.data ?? res.data;
};

export const updatePreferences = async (data) => {
  const res = await api.patch("/preferences", data);
  return res.data.data ?? res.data;
};
