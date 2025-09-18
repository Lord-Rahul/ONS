import api from "./api.js";

class AuthService {
  async login(credentials) {
    try {
      const response = await api.post("/login", credentials);
      const { token, user } = response.data.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async register(userData) {
    try {
      const response = await api.post("/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async logout() {
    try {
      const response = await api.post("/logout");
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
      const response = await api.put("/update", userData);

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
      const response = await api.post("/changepassword", passwordData);
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
