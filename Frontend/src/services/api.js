import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    // ✅ Fixed: Use 'authToken' instead of 'token'
    const token = localStorage.getItem("authToken");
    
    // 🔍 DEBUG LOGS
    console.log('🔍 Making request to:', config.url);
    console.log('🔍 Token from localStorage:', token);
    console.log('🔍 All localStorage keys:', Object.keys(localStorage));
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set:', config.headers.Authorization);
    } else {
      console.log('❌ No token found - request will fail if auth required');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('🔍 API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🔍 401 Error - clearing tokens');
      // ✅ Fixed: Clear the correct key
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;