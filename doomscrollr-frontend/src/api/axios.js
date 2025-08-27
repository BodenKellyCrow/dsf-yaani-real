// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://doomscrollr.onrender.com/api/",
  withCredentials: true,   // ✅ send cookies/session
});

export default api;
