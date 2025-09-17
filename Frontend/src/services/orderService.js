import api from "./api.js";

class OrderService {
  async placeOrder(orderData) {
    try {
      const response = await api.post("/orders/place", orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getUserOrders(page = 1, limit = 10) {
    try {
      const response = await api.get("/orders", {
        params: { page, limit },
      });
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

  async cancelOrderRequest(orderId, reason = "") {
    try {
      const response = await api.put(`/orders/${orderId}/cancel-request`, {
        reason,
      });
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

  getOrderStatusText(status) {
    const statusMap = {
      pending: "Order Placed",
      confirmed: "Confirmed",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      returned: "Returned",
    };
    return statusMap[status] || status;
  }

  getOrderStatusColor(status) {
    const colorMap = {
      pending: "text-yellow-600",
      confirmed: "text-blue-600",
      processing: "text-purple-600",
      shipped: "text-indigo-600",
      delivered: "text-green-600",
      cancelled: "text-red-600",
      returned: "text-gray-600",
    };
    return colorMap[status] || "text-gray-600";
  }
}

export default new OrderService();
