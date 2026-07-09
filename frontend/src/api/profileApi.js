import api from "./axios";

export const getProfile = async () => {
  const res = await api.get("/profile");
  return res.data.data ?? res.data;
};

export const updateProfile = async (data) => {
  const res = await api.patch("/profile", data);
  return res.data.data ?? res.data;
};

export const changePassword = async (data) => {
  const res = await api.patch("/profile/password", data);
  return res.data.data ?? res.data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();

  formData.append("avatar", file);

  const res = await api.patch("/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data ?? res.data;
};
