import api from "./api.js";

class placeOrder {
  async placeOrder(orderData) {
    try {
      const response = await api.post("/orders/place", orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getUserOrders() {
    try {
      const response = await api.get("/orders");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async cancelOrderRequest(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/cancel-request`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async initiatePayment(orderId, paymentMethod = "razorpay") {
    try {
      const response = await api.post(`/payments/initiate/${orderId}`, {
        paymentMethod,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getPaymentStatus(orderId) {
    try {
      const response = await api.get(`/payments/status/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async verifyPayment(paymentData) {
    try {
      const response = await api.post(`/payments/verify`, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  getOrderSummary(cartItems, shippingCost = 0, taxRate = 0.18) {
    const subtotal = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;

    return {
      subtotal,
      shippingCost,
      tax,
      total,
      itemCount: cartItems.length,
    };
  }
}

export default new OrderService();
