import api from "./api.js";

class ProductService {
  async getProducts(params = {}) {
    try {
      console.log("ProductService: Fetching products with params:", params);
      const response = await api.get("/products", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getFeaturedProducts(limit = 8) {
    try {
      return await this.getProducts({ featured: true, limit });
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      console.log('🔍 Product detail response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ProductService getProductById error:', error);
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

  async getProductByCategory(categoryName, filters = {}) {
    try {
      return await this.getProducts({ category: categoryName, ...filters });
    } catch (error) {
      throw error;
    }
  }

  async getProductsPaginated(page = 1, limit = 12, filters = {}) {
    try {
      return await this.getProducts({ page, limit, ...filters });
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductService();
