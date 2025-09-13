import api from "./api.js";

class CartService {
  async getCart() {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async addToCart(productData) {
    try {
      const response = await api.post("/cart/add", productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateCartItem(itemId, updateData) {
    try {
      const response = await api.put(`/cart/item/${itemId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async removeFromCart(itemId) {
    try {
      const response = await api.delete(`/cart/item/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async clearCart() {
    try {
      const response = await api.delete("/cart/clear");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getCartCount() {
    try {
      const cart = await this.getCart();
      return cart.data?.items?.length || 0;
    } catch (error) {
      return 0;
    }
  }

  calculateCartTotal(cartItems) {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }
}

export default new CartService();
