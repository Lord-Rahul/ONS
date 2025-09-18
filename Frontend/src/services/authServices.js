import api from "./api.js";

class AuthService {
  async login(credentials) {
    try {
      // Fix: Add /users prefix to match backend route
      const response = await api.post("/users/login", credentials);
      const { accessToken, user } = response.data.data;

      // Store token and user data
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async register(userData) {
    try {
      // Fix: Add /users prefix
      const response = await api.post("/users/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async logout() {
    try {
      // Fix: Add /users prefix
      const response = await api.post("/users/logout");
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      window.location.href = "/";
      return response.data;
    } catch (error) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      throw error;
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem("authToken");
    return !!token;
  }

  getToken() {
    return localStorage.getItem("authToken");
  }

  async updateProfile(userData) {
    try {
      // Fix: Add /users prefix
      const response = await api.put("/users/update", userData);

      if (response.data.success && response.data.data) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async changePassword(passwordData) {
    try {
      // Fix: Add /users prefix
      const response = await api.post("/users/changepassword", passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  getUser() {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }

  clearAuthData() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
}

export default new AuthService();
