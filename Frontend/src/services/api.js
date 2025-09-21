import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🔍 Making request to:', config.url);
    
    const token = localStorage.getItem('authToken');
    if (token) {
      // ✅ Use the correct Authorization header format for your backend
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set:', config.headers.Authorization);
    } else {
      console.log('⚠️ No token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('❌ Response error:', error.response?.status, error.config?.url);
    
    // Handle token expiration
    if (error.response?.status === 401) {
      console.log('🔓 Unauthorized - clearing auth data');
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;