import api from "./api.js";

class CartService {
  constructor() {
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second base delay
  }

  /**
   * Retry helper with exponential backoff
   */
  async retryWithBackoff(fn, retries = this.maxRetries, delay = this.retryDelay) {
    for (let i = 0; i <= retries; i++) {
      try {
        return await fn();
      } catch (error) {
        const isLastAttempt = i === retries;
        const isRetryable =
          error.response?.status >= 500 || // Server errors
          error.response?.status === 408 || // Request timeout
          error.response?.status === 429 || // Too many requests
          error.code === "ECONNABORTED"; // Connection timeout

        if (isLastAttempt || !isRetryable) {
          throw error;
        }

        // Exponential backoff: 1s, 2s, 4s
        const waitTime = delay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  /**
   * Get user's cart
   */
  async getCart() {
    try {
      const response = await this.retryWithBackoff(() =>
        api.get("/cart")
      );
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch cart";
      throw {
        message: errorMsg,
        status: error.response?.status,
        data: error.response?.data,
      };
    }
  }

  /**
   * Add item to cart with validation
   */
  async addToCart(productData, quantity = 1, size = null, color = null) {
    try {
      const pId = typeof productData === "object"
        ? (productData.productId || productData._id || productData.id)
        : productData;

      requestData = {
        productId: pId,
        quantity: (typeof productData === "object" ? productData.quantity : null) || quantity || 1,
        size: (typeof productData === "object" ? productData.size : null) || size,
        color: (typeof productData === "object" ? productData.color : null) || color,
      };

      // Validate required fields
      if (!requestData.productId) {
        throw new Error("Product ID is required");
      }

      if (!requestData.size) {
        throw new Error("Size is required");
      }

      if (requestData.quantity < 1) {
        throw new Error("Quantity must be at least 1");
      }

      console.log("Adding to cart:", requestData);

      // Make request with retry logic
      const response = await this.retryWithBackoff(() =>
        api.post("/cart/add", requestData)
      );

      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to add item to cart";
      throw {
        message: errorMsg,
        status: error.response?.status,
        data: error.response?.data,
      };
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(itemId, quantity) {
    try {
      if (!itemId) {
        throw new Error("Item ID is required");
      }

      if (quantity < 1 || !Number.isInteger(quantity)) {
        throw new Error("Quantity must be a positive integer");
      }

      const response = await this.retryWithBackoff(() =>
        api.put(`/cart/item/${itemId}`, { quantity })
      );

      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to update cart item";
      throw {
        message: errorMsg,
        status: error.response?.status,
        data: error.response?.data,
      };
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(itemId) {
    try {
      if (!itemId) {
        throw new Error("Item ID is required");
      }

      const response = await this.retryWithBackoff(() =>
        api.delete(`/cart/item/${itemId}`)
      );

      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove item from cart";
      throw {
        message: errorMsg,
        status: error.response?.status,
        data: error.response?.data,
      };
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart() {
    try {
      const response = await this.retryWithBackoff(() =>
        api.delete("/cart/clear")
      );

      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to clear cart";
      throw {
        message: errorMsg,
        status: error.response?.status,
        data: error.response?.data,
      };
    }
  }

  /**
   * Get cart item count
   */
  async getCartCount() {
    try {
      const response = await this.getCart();
      return response.data?.items?.length || 0;
    } catch (error) {
      console.error("Error getting cart count:", error);
      return 0;
    }
  }

  /**
   * Calculate cart total with validation
   */
  calculateCartTotal(cartItems) {
    if (!Array.isArray(cartItems)) {
      return 0;
    }

    return cartItems.reduce((total, item) => {
      const price = item.product?.price || item.price || 0;
      const quantity = item.quantity || 0;
      const itemTotal = price * quantity;

      // Validate numbers
      if (!Number.isFinite(itemTotal)) {
        console.warn("Invalid item total:", item);
        return total;
      }

      return total + itemTotal;
    }, 0);
  }
}

export default new CartService();
