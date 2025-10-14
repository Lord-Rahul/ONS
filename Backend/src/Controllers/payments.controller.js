import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Order } from "../models/order.model.js";
import { sendPaymentSuccessEmail } from "../services/email.service.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayPayment,
} from "../utils/razorpay.utils.js";
import { RAZORPAY_CONFIG } from "../config/razorpay.config.js";
import mongoose from "mongoose";

const initiatePayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status !== "pending") {
    throw new ApiError(400, "Order is not eligible for payment");
  }

  if (order.paymentDetails.status === "completed") {
    throw new ApiError(400, "Payment already completed for this order");
  }

  const transactionId = `TXN_${order.orderNumber}_${Date.now()}`;

  const paymentData = {
    amount: order.totalAmount,
    transactionId,
    orderId: order._id,
    userId: userId.toString(),
  };

  try {
    const razorpayOrder = await createRazorpayOrder(paymentData);

    if (razorpayOrder.success) {
      // Update order with Razorpay order details
      await Order.findByIdAndUpdate(orderId, {
        "paymentDetails.transactionId": transactionId,
        "paymentDetails.gatewayOrderId": razorpayOrder.data.id,
        "paymentDetails.status": "processing",
      });

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            razorpayOrderId: razorpayOrder.data.id,
            amount: razorpayOrder.data.amount,
            currency: razorpayOrder.data.currency,
            keyId: RAZORPAY_CONFIG.KEY_ID,
            orderId: order._id,
            orderNumber: order.orderNumber,
            transactionId,
            customerDetails: {
              name: order.shippingAddress.fullName,
              email: order.shippingAddress.email,
              phone: order.shippingAddress.phone,
            },
          },
          "Payment initiated successfully"
        )
      );
    } else {
      throw new ApiError(400, "Payment initiation failed");
    }
  } catch (error) {
    await Order.findByIdAndUpdate(orderId, {
      "paymentDetails.status": "failed",
    });

    throw new ApiError(500, `Payment initiation failed: ${error.message}`);
  }
});

const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !orderId
  ) {
    throw new ApiError(400, "Missing required payment verification data");
  }

  try {
    // Verify payment signature
    const isValidSignature = verifyRazorpayPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValidSignature) {
      throw new ApiError(400, "Invalid payment signature");
    }

    // Get payment details from Razorpay
    const paymentDetails = await getRazorpayPayment(razorpay_payment_id);

    // Find and update order
    const order = await Order.findOne({
      _id: orderId,
      "paymentDetails.gatewayOrderId": razorpay_order_id,
    });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (paymentDetails.status === "captured") {
      // Payment successful
      await Order.findByIdAndUpdate(order._id, {
        "paymentDetails.status": "completed",
        "paymentDetails.gatewayPaymentId": razorpay_payment_id,
        "paymentDetails.paidAt": new Date(),
        status: "confirmed",
        confirmedAt: new Date(),
      });

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            orderId: order._id,
            orderNumber: order.orderNumber,
            paymentId: razorpay_payment_id,
            paymentStatus: "completed",
          },
          "Payment verified successfully"
        )
      );
    } else {
      // Payment failed
      await Order.findByIdAndUpdate(order._id, {
        "paymentDetails.status": "failed",
      });

      throw new ApiError(400, "Payment verification failed");
    }
  } catch (error) {
    throw new ApiError(500, `Payment verification failed: ${error.message}`);
  }
});

const getPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  sendPaymentSuccessEmail();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentDetails.status,
        transactionId: order.paymentDetails.transactionId,
        paidAt: order.paymentDetails.paidAt,
      },
      "Payment status fetched successfully"
    )
  );
});

export { initiatePayment, verifyPayment, getPaymentStatus };
