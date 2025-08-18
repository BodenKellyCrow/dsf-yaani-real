import axios from 'axios';

const api = axios.create({
  baseURL: 'https://doomscrollr-backend.onrender.com/api/', // your backend URL here
  withCredentials: true
});

export default api;
