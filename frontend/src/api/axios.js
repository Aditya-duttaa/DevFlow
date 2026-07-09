import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue = [];

function resolveRefreshQueue(error, token = null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(token);
  });

  refreshQueue = [];
}

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            refreshQueue.push({ resolve, reject });
          });

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (e) {
          return Promise.reject(e);
        }
      }

      isRefreshing = true;

      try {
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        const accessToken =
          response.data.data?.accessToken ??
          response.data.accessToken;

        localStorage.setItem(
          "accessToken",
          accessToken
        );

        resolveRefreshQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (e) {
        resolveRefreshQueue(e, null);

        localStorage.removeItem(
          "accessToken"
        );
        localStorage.removeItem("org");
        localStorage.removeItem("member");

        window.location.replace("/login");

        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
