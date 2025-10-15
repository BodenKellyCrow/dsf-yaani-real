import axios from 'axios';
import axiosRetry from 'axios-retry'; // ⭐️ Import the retry module

const api = axios.create({
  baseURL: 'https://doomscrollr.onrender.com/api/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ====================================================================
// ⭐️ COLD START RETRY LOGIC (Integrated using axios-retry) ⭐️
// This runs BEFORE the main interceptor, ensuring cold-start retries happen first.
// ====================================================================
axiosRetry(api, {
    retries: 10, // Max 10 retries
    retryDelay: (retryCount) => {
        const delay = 2000; // 2-second delay
        console.log(`[AXIOS RETRY] Cold-Start Retrying request (Attempt ${retryCount} of 10). Waiting ${delay/1000}s...`);
        return delay; 
    },
    // Only retry on 502 (Bad Gateway) errors, and general network errors.
    retryCondition: (error) => {
        const is502 = error.response && error.response.status === 502;
        const isNetworkError = axiosRetry.isNetworkError(error);
        
        // IMPORTANT: We explicitly exclude 401 from cold-start retry
        // because the main interceptor handles the 401 token refresh.
        const is401 = error.response && error.response.status === 401;

        if (is401) return false;
        
        return is502 || isNetworkError;
    },
});
// ====================================================================


// ✅ Request Interceptor: Attach JWT token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// ✅ Response Interceptor: Handle token refresh on 401
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // ⭐️ The 502 errors have already been handled by axios-retry here.
    // This part only needs to worry about 401 token refresh.

    // If 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // No refresh token available, logout
        isRefreshing = false;
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Perform token refresh using plain axios to avoid infinite loop
        const response = await axios.post(
          'https://doomscrollr.onrender.com/api/token/refresh/',
          { refresh: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        );

        const { access } = response.data;
        
        // Store new access token
        localStorage.setItem('accessToken', access);
        
        // Update default header
        api.defaults.headers.common.Authorization = `Bearer ${access}`;
        
        // Update original request header
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Process queued requests
        processQueue(null, access);
        isRefreshing = false;
        
        // Retry original request with new token
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null);
        isRefreshing = false;
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;