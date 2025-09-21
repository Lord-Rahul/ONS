import api from './api.js';

class AuthService {
  async login(credentials) {
    try {
      const response = await api.post('/users/login', credentials);
      
      if (response.data.success) {
        // ✅ Store both user data AND the token
        const userData = response.data.data;
        localStorage.setItem('user', JSON.stringify(userData.user));
        
        // ✅ Save the access token for cart operations
        if (userData.accessToken) {
          localStorage.setItem('authToken', userData.accessToken);
          console.log('✅ Token saved:', userData.accessToken);
        }
        
        return response.data;
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      console.error('AuthService login error:', error);
      throw this.handleAuthError(error);
    }
  }

  async register(userData) {
    try {
      const sanitizedData = this.sanitizeUserData(userData);
      const response = await api.post('/users/register', sanitizedData);
      
      if (response.data.success) {
        const responseData = response.data.data;
        localStorage.setItem('user', JSON.stringify(responseData.user));
        
        // ✅ Save token for register too
        if (responseData.accessToken) {
          localStorage.setItem('authToken', responseData.accessToken);
        }
        
        return response.data;
      }
      
      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      console.error('AuthService register error:', error);
      throw this.handleAuthError(error);
    }
  }

  async logout() {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  }

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  }

  getUser() {
    return this.getCurrentUser();
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    const token = localStorage.getItem('authToken');
    return !!(user && token);
  }

  async checkAuthStatus() {
    try {
      const user = this.getCurrentUser();
      const token = localStorage.getItem('authToken');
      
      if (!user || !token) {
        console.log('❌ No user or token found');
        return false;
      }

      console.log('✅ User and token found - authenticated');
      return true;
    } catch (error) {
      console.error('Auth status check failed:', error);
      return false;
    }
  }

  sanitizeUserData(userData) {
    const sanitized = {};
    
    if (userData.email) {
      sanitized.email = userData.email.toLowerCase().trim();
    }
    
    if (userData.name) {
      sanitized.name = userData.name.trim().replace(/[<>"/]/g, '');
    }
    
    if (userData.password) {
      sanitized.password = userData.password;
    }
    
    return sanitized;
  }

  handleAuthError(error) {
    if (error.response?.status === 401) {
      this.logout();
      return new Error('Session expired. Please login again.');
    }
    
    return error.response?.data || error;
  }
}

export default new AuthService();
