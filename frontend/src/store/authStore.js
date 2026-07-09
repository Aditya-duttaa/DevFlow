import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),

  login: (user, token) => {
    const previousUserId = localStorage.getItem("authUserId");

    if (previousUserId && previousUserId !== user?.id) {
      localStorage.removeItem("org");
      localStorage.removeItem("member");
      localStorage.removeItem("workspaceUserId");
    }

    localStorage.setItem("accessToken", token);
    localStorage.setItem("authUserId", user?.id || "");

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUserId");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  setUser: (user) =>
    {
      if (user?.id) {
        localStorage.setItem("authUserId", user.id);
      }

      set({
        user,
      });
    },

  hydrate: () => {
    const token = localStorage.getItem("accessToken");

    set({
      token,
      isAuthenticated: !!token,
    });
  },

  clearUser: () =>
    set({
      user: null,
    }),
}));

export default useAuthStore;
