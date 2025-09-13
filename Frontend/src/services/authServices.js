import api from "./api.js";

class AuthService {
  async login(credentials) {
    try {
      const response = await api.post("/users/login", credentials);
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
      const response = await api.post("/users/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
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
      const response = await api.put("/users/profile", userData);
      const updatedUser = response.data.data;

      localStorage.setItem("user", JSON.stringify(updatedUser));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new AuthService();
