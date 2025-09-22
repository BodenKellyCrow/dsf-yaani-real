// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://doomscrollr.onrender.com/api/",
});

// Attach JWT access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // must match login storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
