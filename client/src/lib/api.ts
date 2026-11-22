import axios from "axios";

let rawUrl = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env as any).client_key ||
  (import.meta.env as any).CLIENT_KEY ||
  ""
).trim();

if (!rawUrl) {
  rawUrl = "http://localhost:5000/api";
} else {
  // Remove trailing slashes
  rawUrl = rawUrl.replace(/\/+$/, "");
  // Ensure it points to /api
  if (!rawUrl.endsWith("/api")) {
    rawUrl = `${rawUrl}/api`;
  }
}

const api = axios.create({
  baseURL: rawUrl,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;