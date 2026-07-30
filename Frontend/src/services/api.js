import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Increased timeout
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('[API] Request:', config.method.toUpperCase(), config.url);

    // Add auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add idempotency key for mutation requests
    if (['post', 'put', 'patch'].includes(config.method?.toLowerCase())) {
      const idempotencyKey = config.headers['X-Idempotency-Key'] ||
        `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      config.headers['X-Idempotency-Key'] = idempotencyKey;
    }

    return config;
  },
  (error) => {
    console.error('[API] Request error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('[API] Response:', response.status, response.config.url);

    return response;
  },
  async (error) => {
    const config = error.config;

    // Handle 401 (Unauthorized)
    if (error.response?.status === 401) {
      console.warn('[API] Unauthorized - clearing auth');
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }

    // Handle 403 (Forbidden)
    if (error.response?.status === 403) {
      console.warn('[API] Access forbidden');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }

      return Promise.reject(error);
    }

    // Enhanced error logging
    const errorInfo = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: config?.url,
      method: config?.method?.toUpperCase(),
      timestamp: new Date().toISOString(),
    };

    console.error('[API] Error:', errorInfo);

    return Promise.reject(error);
  }
);

/**
 * Utility to format API errors for display
 */
export const formatApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.status === 404) {
    return 'Resource not found';
  }

  if (error.response?.status === 500) {
    return 'Server error. Please try again later.';
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please check your connection.';
  }

  if (!error.response) {
    return 'Network error. Please check your connection.';
  }

  return error.message || 'An error occurred. Please try again.';
};

export default api;