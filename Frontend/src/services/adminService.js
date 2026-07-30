import api from './api.js';

const toFormData = (payload) => {
  if (payload instanceof FormData) {
    return payload;
  }

  const formData = new FormData();

  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (key === 'image' && value instanceof File) {
      formData.append('image', value);
      return;
    }

    if (key === 'images' && Array.isArray(value)) {
      value.forEach((file) => {
        if (file instanceof File) {
          formData.append('images', file);
        }
      });
      return;
    }

    if (Array.isArray(value) || typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, value);
  });

  return formData;
};

const adminService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Products Management
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/admin/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addProduct: async (productData) => {
    try {
      const response = await api.post('/admin/products', toFormData(productData), {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/admin/products/${productId}`, toFormData(productData), {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/admin/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getProduct: async (productId) => {
    try {
      const response = await api.get(`/admin/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Orders Management
  getOrders: async (params = {}) => {
    try {
      const response = await api.get('/admin/orders', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Users Management
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Categories Management
  getCategories: async () => {
    try {
      const response = await api.get('/admin/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addCategory: async (categoryData) => {
    try {
      const response = await api.post('/admin/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      const response = await api.delete(`/admin/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reports
  getSalesReport: async (params = {}) => {
    try {
      const response = await api.get('/admin/reports/sales', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getProductAnalytics: async (productId) => {
    try {
      const response = await api.get(`/admin/analytics/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default adminService;
