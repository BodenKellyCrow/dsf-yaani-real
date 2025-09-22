import axios from "axios";

const api = axios.create({
  baseURL: "https://doomscrollr.onrender.com/api/",
  withCredentials: true,  // ✅ keep for cookies
});

// ✅ attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
