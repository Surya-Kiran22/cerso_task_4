import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract data and handle global 401 Auto-Logout
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // Clear token on 401 Unauthorized / Expired Token
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Dispatch global event for AuthContext to reset state
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));

      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    // Standardize error payload
    const errorData = error.response?.data || {
      success: false,
      message: error.message || 'Network error occurred',
    };

    return Promise.reject(errorData);
  }
);

export default axiosClient;
