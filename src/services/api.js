import axios from "axios";

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000") + "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ✅ Add token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // ✅ If sending FormData, do NOT set Content-Type manually
  // axios will set correct boundary automatically
  const isFormData = config.data instanceof FormData;
  if (!isFormData) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// ✅ Optional: handle expired token globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // If token invalid/expired → clear storage
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // optional redirect:
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
