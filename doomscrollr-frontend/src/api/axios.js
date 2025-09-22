import axios from 'axios';

const api = axios.create({
  baseURL: 'https://doomscrollr.onrender.com/api/',
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Only retry once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Get new access token
        const res = await axios.post(
          'https://doomscrollr.onrender.com/api/auth/token/refresh/',
          { refresh: refreshToken }
        );

        localStorage.setItem('accessToken', res.data.access);

        // Update original request with new token
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

        return api(originalRequest); // retry once
      } catch (err) {
        // Refresh token invalid → force logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
