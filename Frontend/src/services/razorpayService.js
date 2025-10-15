import api from './api.js';
import { loadRazorpayScript } from '../utils/razorpayLoader.js';

class RazorpayService {
  constructor() {
    this.razorpay = null;
  }

  // Load Razorpay script using utility
  async loadRazorpayScript() {
    try {
      await loadRazorpayScript();
      this.razorpay = window.Razorpay;
      console.log(' Razorpay script loaded successfully');
      return window.Razorpay;
    } catch (error) {
      console.error(' Failed to load Razorpay script:', error);
      throw error;
    }
  }

  // Initiate payment with backend
  async initiatePayment(orderId) {
    try {
      console.log(' Initiating Razorpay payment for order:', orderId);
      const response = await api.post(`/payments/razorpay/initiate/${orderId}`);
      
      if (response.data.success) {
        console.log(' Payment initiated:', response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error(' Payment initiation error:', error);
      throw error.response?.data || error;
    }
  }

  // Open Razorpay checkout
  async openCheckout(paymentData, options = {}) {
    try {
      await this.loadRazorpayScript();

      if (!window.Razorpay) {
        throw new Error('Razorpay not loaded');
      }

      return new Promise((resolve, reject) => {
        const rzpOptions = {
          key: paymentData.keyId || paymentData.key_id,
          amount: paymentData.amount,
          currency: paymentData.currency || 'INR',
          name: options.businessName || 'ONS Store',
          description: options.description || 'Order Payment',
          image: options.logo || '/logo.png',
          order_id: paymentData.razorpayOrderId || paymentData.id,
          
          // Customer details
          prefill: {
            name: options.customerName || '',
            email: options.customerEmail || '',
            contact: options.customerPhone || '',
          },
          
          // Theme
          theme: {
            color: options.themeColor || '#000000',
          },
          
          // Success handler
          handler: async (response) => {
            console.log(' Razorpay payment success:', response);
            try {
              const verificationResult = await this.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: paymentData.orderId,
              });
              resolve(verificationResult);
            } catch (error) {
              console.error(' Payment verification failed:', error);
              reject(error);
            }
          },
          
          // Error handler
          modal: {
            ondismiss: () => {
              console.log(' Razorpay checkout dismissed');
              reject(new Error('Payment cancelled by user'));
            },
          },
        };

        console.log(' Opening Razorpay checkout');
        const rzp = new window.Razorpay(rzpOptions);

        rzp.on('payment.failed', (response) => {
          console.error(' Razorpay payment failed:', response.error);
          reject(new Error(response.error.description || 'Payment failed'));
        });

        rzp.open();
      });
    } catch (error) {
      console.error(' Razorpay checkout error:', error);
      throw error;
    }
  }

  // Verify payment with backend
  async verifyPayment(paymentData) {
    try {
      console.log(' Verifying Razorpay payment:', paymentData);
      const response = await api.post('/payments/razorpay/verify', paymentData);
      
      if (response.data.success) {
        console.log(' Payment verified:', response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error(' Payment verification error:', error);
      throw error.response?.data || error;
    }
  }

  // Get payment status
  async getPaymentStatus(orderId) {
    try {
      const response = await api.get(`/payments/razorpay/status/${orderId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Complete payment flow
  async processPayment(orderId, customerDetails = {}) {
    try {
      console.log(' Processing payment for order:', orderId);
      
      // Step 1: Initiate payment
      const paymentData = await this.initiatePayment(orderId);
      
      // Step 2: Open Razorpay checkout
      const verificationResult = await this.openCheckout(paymentData, {
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        businessName: 'ONS Store',
        description: `Payment for Order #${paymentData.orderNumber || orderId}`,
        themeColor: '#000000',
      });
      
      return verificationResult;
    } catch (error) {
      console.error(' Payment process error:', error);
      throw error;
    }
  }
}

//  Export as default
const razorpayService = new RazorpayService();
export default razorpayService;