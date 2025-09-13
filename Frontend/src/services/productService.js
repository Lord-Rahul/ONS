import api from "./api.js";

class ProductService {
  async getProducts(params = {}) {
    try {
      const response = await api.get("/products", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getCategories() {
    try {
      const response = await api.get("/category");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getCategoryById(id) {
    try {
      const response = await api.get(`/category/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async searchProducts(query, filters = {}) {
    try {
      const params = { search: query, ...filters };
      const response = await api.get("/products", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}


export default new ProductService();