import axios from 'axios';

const api = axios.create({
  baseURL: 'https://doomscrollr-backend.onrender.com', // your backend URL here
});

export default api;
