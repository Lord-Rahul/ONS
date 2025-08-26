import Razorpay from 'razorpay';
import crypto from 'crypto';
import { RAZORPAY_CONFIG } from '../config/razorpay.config.js';


const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_CONFIG.KEY_ID,
  key_secret: RAZORPAY_CONFIG.KEY_SECRET,
});


export const createRazorpayOrder = async (orderData) => {
  try {
    const options = {
      amount: orderData.amount * 100, 
      currency: 'INR',
      receipt: orderData.transactionId,
      payment_capture: 1,
      notes: {
        orderId: orderData.orderId,
        userId: orderData.userId,
      }
    };

    console.log("Creating Razorpay order:", options);

    const order = await razorpayInstance.orders.create(options);
    
    console.log("Razorpay order created:", order);
    
    return {
      success: true,
      data: order
    };
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    throw new Error(`Razorpay order creation failed: ${error.message}`);
  }
};


export const verifyRazorpayPayment = (paymentData) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_CONFIG.KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;
    
    console.log("Payment verification:", {
      body,
      expectedSignature,
      receivedSignature: razorpay_signature,
      isAuthentic
    });

    return isAuthentic;
  } catch (error) {
    console.error("Payment verification failed:", error);
    return false;
  }
};


export const getRazorpayPayment = async (paymentId) => {
  try {
    const payment = await razorpayInstance.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    throw new Error(`Failed to fetch payment: ${error.message}`);
  }
};