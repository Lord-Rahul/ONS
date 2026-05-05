import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Order } from "../models/order.model.js";
import {
  createPhonePePayment,
  verifyPhonePePayment,
} from "../utils/phonepe.utils.js";
import { sendPaymentSuccessEmail } from "../services/email.service.js";
import mongoose from "mongoose";

// Idempotency key tracking to prevent duplicate payments
const paymentAttempts = new Map();

const validateOrderForPayment = (order) => {
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.paymentDetails?.status === "completed") {
    throw new ApiError(400, "Payment already completed for this order");
  }

  if (order.paymentDetails?.status === "processing") {
    throw new ApiError(
      400,
      "Payment already in progress. Please check your bank app or try again in a few moments."
    );
  }

  if (order.status !== "pending") {
    throw new ApiError(400, `Order cannot be paid in ${order.status} status`);
  }

  return true;
};

const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    throw new ApiError(400, "Phone number is required");
  }

  const cleaned = String(phoneNumber).replace(/\D/g, "");

  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    throw new ApiError(
      400,
      "Invalid phone number. Please provide a valid 10-digit Indian number."
    );
  }

  return cleaned;
};

const initiatePayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { idempotencyKey } = req.body;
  const userId = req.user._id;

  // Validate order ID
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID format");
  }

  // Check for duplicate payment request (idempotency)
  if (idempotencyKey) {
    const recentAttempt = paymentAttempts.get(idempotencyKey);
    if (recentAttempt && Date.now() - recentAttempt.timestamp < 30000) {
      // 30 second window for retries
      if (recentAttempt.result) {
        return res.status(200).json(recentAttempt.result);
      }
    }
  }

  // Fetch and validate order with atomic check
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  validateOrderForPayment(order);

  // Validate phone number
  const phoneNumber = validatePhoneNumber(order.shippingAddress.phone);

  // Validate order total
  if (!order.totalAmount || order.totalAmount <= 0) {
    throw new ApiError(400, "Invalid order amount");
  }

  // Generate transaction ID with order number and timestamp
  const transactionId = `TXN_${order.orderNumber}_${Date.now()}`;

  const paymentData = {
    transactionId,
    userId: userId.toString(),
    amount: order.totalAmount,
    mobileNumber: phoneNumber,
  };

  try {
    // Call payment gateway
    const paymentResponse = await createPhonePePayment(paymentData);

    if (!paymentResponse.success) {
      // Mark payment as failed atomically
      await Order.findOneAndUpdate(
        { _id: orderId, "paymentDetails.status": { $ne: "completed" } },
        {
          $set: {
            "paymentDetails.status": "failed",
            "paymentDetails.failureReason":
              paymentResponse.message || "Gateway error",
            "paymentDetails.failedAt": new Date(),
          },
        }
      );

      throw new ApiError(
        402,
        paymentResponse.message || "Payment gateway error. Please try again."
      );
    }

    // Atomically update order to processing state
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        "paymentDetails.status": { $ne: "processing", $ne: "completed" },
      },
      {
        $set: {
          "paymentDetails.transactionId": transactionId,
          "paymentDetails.gatewayOrderId":
            paymentResponse.data.merchantTransactionId,
          "paymentDetails.status": "processing",
          "paymentDetails.initiatedAt": new Date(),
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      throw new ApiError(
        409,
        "Payment already in progress for this order. Please check your bank app or wait a moment."
      );
    }

    // Extract payment URL safely
    const paymentUrl =
      paymentResponse.data?.instrumentResponse?.redirectInfo?.url;

    if (!paymentUrl) {
      throw new ApiError(500, "Payment gateway returned invalid response");
    }

    const responseData = {
      paymentUrl,
      transactionId,
      orderId,
      orderNumber: order.orderNumber,
    };

    // Store for idempotency
    if (idempotencyKey) {
      paymentAttempts.set(idempotencyKey, {
        result: new ApiResponse(
          200,
          responseData,
          "Payment initiated successfully"
        ),
        timestamp: Date.now(),
      });
    }

    return res.status(200).json(
      new ApiResponse(200, responseData, "Payment initiated successfully")
    );
  } catch (error) {
    // Ensure payment marked as failed
    if (error.statusCode !== 409) {
      // Don't update if conflict (already processing)
      await Order.findOneAndUpdate(
        { _id: orderId, "paymentDetails.status": { $ne: "completed" } },
        {
          $set: {
            "paymentDetails.status": "failed",
            "paymentDetails.failureReason":
              error.message || "Unexpected error",
            "paymentDetails.failedAt": new Date(),
          },
        }
      );
    }

    throw error;
  }
});

const handlePaymentCallback = asyncHandler(async (req, res) => {
  const { transactionId } = req.body;

  // Validate transaction ID
  if (!transactionId || typeof transactionId !== "string") {
    throw new ApiError(400, "Valid transaction ID is required");
  }

  try {
    // Verify payment status with gateway
    const paymentStatus = await verifyPhonePePayment(transactionId);

    // Find order by transaction ID
    const order = await Order.findOne({
      "paymentDetails.transactionId": transactionId,
    });

    if (!order) {
      console.warn(`Order not found for transaction: ${transactionId}`);
      throw new ApiError(404, "Order not found for this transaction");
    }

    // Validate gateway response
    if (
      !paymentStatus ||
      typeof paymentStatus.success !== "boolean" ||
      !paymentStatus.data
    ) {
      throw new ApiError(500, "Invalid payment gateway response");
    }

    // Handle successful payment
    if (paymentStatus.success && paymentStatus.data.state === "COMPLETED") {
      // Atomically mark order as paid (idempotent)
      const updatedOrder = await Order.findOneAndUpdate(
        {
          _id: order._id,
          "paymentDetails.status": { $ne: "completed" },
        },
        {
          $set: {
            "paymentDetails.status": "completed",
            "paymentDetails.gatewayPaymentId": paymentStatus.data.transactionId,
            "paymentDetails.paidAt": new Date(),
            status: "confirmed",
            confirmedAt: new Date(),
          },
        },
        { new: true }
      );

      // If order already completed by another request, return success (idempotent)
      if (!updatedOrder) {
        return res.status(200).json(
          new ApiResponse(
            200,
            {
              orderId: order._id,
              orderNumber: order.orderNumber,
              paymentStatus: "completed",
            },
            "Payment already confirmed"
          )
        );
      }

      // Send confirmation email asynchronously (non-blocking)
      sendPaymentSuccessEmail(updatedOrder).catch((error) => {
        console.error(
          `Failed to send payment email for order ${order._id}:`,
          error.message
        );
      });

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            orderId: updatedOrder._id,
            orderNumber: updatedOrder.orderNumber,
            paymentStatus: "completed",
            paidAt: updatedOrder.paymentDetails.paidAt,
          },
          "Payment completed successfully"
        )
      );
    }

    // Handle failed payment
    const failureReason =
      paymentStatus.message || "Payment declined by gateway";

    const failedOrder = await Order.findOneAndUpdate(
      {
        _id: order._id,
        "paymentDetails.status": { $ne: "completed" },
      },
      {
        $set: {
          "paymentDetails.status": "failed",
          "paymentDetails.failureReason": failureReason,
          "paymentDetails.failedAt": new Date(),
        },
      },
      { new: true }
    );

    // If already completed, still return success (avoid changing completed payments)
    if (!failedOrder && order.paymentDetails.status === "completed") {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            orderId: order._id,
            orderNumber: order.orderNumber,
            paymentStatus: "completed",
          },
          "Payment already confirmed"
        )
      );
    }

    return res.status(402).json(
      new ApiResponse(
        402,
        {
          orderId: order._id,
          orderNumber: order.orderNumber,
          paymentStatus: "failed",
          reason: failureReason,
        },
        "Payment failed. Please retry or use a different payment method."
      )
    );
  } catch (error) {
    console.error(`Payment callback error for transaction ${transactionId}:`, error.message);

    throw new ApiError(
      500,
      "Payment verification failed. Your payment is being verified. Please check your order status shortly."
    );
  }
});

const getPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  // Validate order ID
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID format");
  }

  // Fetch order
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Build payment status response
  const paymentDetails = {
    orderId: order._id,
    orderNumber: order.orderNumber,
    status: order.paymentDetails?.status || "pending",
    totalAmount: order.totalAmount,
    orderStatus: order.status,
  };

  // Add conditional fields based on status
  if (order.paymentDetails?.transactionId) {
    paymentDetails.transactionId = order.paymentDetails.transactionId;
  }

  if (order.paymentDetails?.paidAt) {
    paymentDetails.paidAt = order.paymentDetails.paidAt;
  }

  if (
    order.paymentDetails?.status === "failed" &&
    order.paymentDetails?.failureReason
  ) {
    paymentDetails.failureReason = order.paymentDetails.failureReason;
    paymentDetails.canRetry = true; // Allow user to retry
  }

  if (order.paymentDetails?.status === "processing") {
    paymentDetails.message =
      "Payment is being processed. Please wait or check your bank app.";
  }

  return res.status(200).json(
    new ApiResponse(200, paymentDetails, "Payment status fetched successfully")
  );
});

export { initiatePayment, getPaymentStatus, handlePaymentCallback };
