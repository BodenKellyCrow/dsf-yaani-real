// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://doomscrollr.onrender.com/api/",
  withCredentials: true,
});

// 🔑 Attach token automatically on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`; 
      // 👆 If your backend expects "Bearer <token>", change to:
      // config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
