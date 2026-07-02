import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),

  login: (user, token) => {
    localStorage.setItem("accessToken", token);

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("accessToken");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  setUser: (user) => set({ user }),

  // ✅ ADD THIS HERE
  hydrate: () => {
    const token = localStorage.getItem("accessToken");

    set({
      token,
      isAuthenticated: !!token,
    });
  },
}));

export default useAuthStore;