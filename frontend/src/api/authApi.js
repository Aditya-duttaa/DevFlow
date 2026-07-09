import api from "./axios";

export const signup = async (data) => {
  const res = await api.post("/auth/signup", data);
  return res.data.data ?? res.data;
};

export const login = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data.data ?? res.data;
};

export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data.data ?? res.data;
};

export const refreshToken = async () => {
  const res = await api.post("/auth/refresh");
  return res.data.data ?? res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data.data ?? res.data;
};

export const getCurrentUser = getMe;

export const logoutAll = async () => {
  const res = await api.post("/auth/logout-all");
  return res.data;
};
