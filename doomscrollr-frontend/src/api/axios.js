// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://https://doomscrollr.onrender.com/api/', // ✅ backend base URL
  withCredentials: true, // ✅ must be capital C
});

export default api;

