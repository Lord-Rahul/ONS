import api from './api.js';

class OrderService {
  // Place a new order
  async placeOrder(orderData) {
    try {
      console.log('📦 OrderService: Placing order with data:', orderData);
      
      // ✅ FIX: Use /orders/place endpoint
      const response = await api.post('/orders/place', orderData);
      console.log('✅ OrderService: Order placed successfully:', response.data);
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Order placed successfully'
      };
    } catch (error) {
      console.error('❌ OrderService: Place order error:', error);
      
      // Better error handling - extract actual error message
      let errorMessage = 'Failed to place order';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data) {
        // Sometimes the error is in the response data directly
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
        message: errorMessage
      };
    }
  }

  // Get user orders
  async getUserOrders(page = 1, limit = 10) {
    try {
      console.log('📋 OrderService: Fetching user orders');
      
      const response = await api.get(`/orders?page=${page}&limit=${limit}`);
      console.log('✅ OrderService: Orders fetched successfully');
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Orders fetched successfully'
      };
    } catch (error) {
      console.error('❌ OrderService: Get orders error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch orders';
      
      return {
        success: false,
        error: errorMessage,
        message: errorMessage
      };
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    try {
      console.log('🔍 OrderService: Fetching order:', orderId);
      
      const response = await api.get(`/orders/${orderId}`);
      console.log('✅ OrderService: Order fetched successfully');
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Order fetched successfully'
      };
    } catch (error) {
      console.error('❌ OrderService: Get order error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch order';
      
      return {
        success: false,
        error: errorMessage,
        message: errorMessage
      };
    }
  }

  // Cancel order
  async cancelOrder(orderId, reason) {
    try {
      console.log('❌ OrderService: Cancelling order:', orderId);
      
      const response = await api.put(`/orders/${orderId}/cancel-request`, {
        reason
      });
      
      console.log('✅ OrderService: Order cancellation requested');
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Order cancellation requested'
      };
    } catch (error) {
      console.error('❌ OrderService: Cancel order error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to request order cancellation';
      
      return {
        success: false,
        error: errorMessage,
        message: errorMessage
      };
    }
  }
}

const orderService = new OrderService();
export default orderService;
