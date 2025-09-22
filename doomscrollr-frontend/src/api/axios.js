import axios from 'axios';

const api = axios.create({
  baseURL: 'https://doomscrollr.onrender.com/api/',
});

let isRefreshing = false;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) return Promise.reject(error);
      isRefreshing = true;
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          'https://doomscrollr.onrender.com/api/auth/token/refresh/',
          { refresh: refreshToken }
        );

        localStorage.setItem('accessToken', res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

        isRefreshing = false;
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
