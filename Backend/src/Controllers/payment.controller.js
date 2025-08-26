import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Order } from "../models/order.model.js";
import {
  createPhonePePayment,
  verifyPhonePePayment,
} from "../utils/phonepe.utils.js";
import mongoose from "mongoose";

const initiatePayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const order = await Order.findOne({ _id: orderId, user: userId }).populate(
    "user",
    "fullName email phone"
  );

  if (!order) {
    throw new ApiError(404, "order not found");
  }

  if (order.status !== "pending") {
    throw new ApiError(400, "order cannot be done ");
  }

  if (order.paymentDetails.status === "completed") {
    throw new ApiError(400, "Payment already completed for this order ");
  }
  const number = order.shippingAddress.phone;

  if (!number || !/^[6-9]\d{9}$/.test(number.toString())) {
    throw new ApiError(
      400,
      "Valid 10-digit mobile number is required for payment"
    );
  }

  const transactionId = `TXN_${order.orderNumber}_${Date.now()}`;

  const paymentData = {
    transactionId,
    userId: userId.toString(),
    amount: order.totalAmount,
    mobileNumber: number,
  };

  try {
    const paymentResponse = await createPhonePePayment(paymentData);

    if (paymentResponse.success) {
      await Order.findByIdAndUpdate(orderId, {
        "paymentDetails.transactionId": transactionId,
        "paymentDetails.gatewayOrderId":
          paymentResponse.data.merchantTransactionId,
        "paymentDetails.status": "processing",
      });

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            paymentUrl:
              paymentResponse.data.instrumentResponse.redirectInfo.url,
            transactionId,
            orderId,
          },
          "Payment initiated successfully"
        )
      );
    } else {
      await Order.findByIdAndUpdate(order._id, {
        "paymentDetails.status": "failed",
      });

      return res.status(400).json(
        new ApiResponse(
          400,
          {
            orderId: order._id,
            paymentStatus: "failed",
          },
          "Payment failed"
        )
      );
    }
  } catch (error) {
    throw new ApiError(500, `payment verification failed : ${error.message}`);
  }
});

const handlePaymentCallback = asyncHandler(async (req, res) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    throw new ApiError(400, "Transaction ID is required");
  }

  try {
    const paymentStatus = await verifyPhonePePayment(transactionId);

    const order = await Order.findOne({
      "paymentDetails.transactionId": transactionId,
    });

    if (!order) {
      throw new ApiError(404, "Order not found for this transaction");
    }

    if (paymentStatus.success && paymentStatus.data.state === "COMPLETED") {
      await Order.findByIdAndUpdate(order._id, {
        "paymentDetails.status": "completed",
        "paymentDetails.gatewayPaymentId": paymentStatus.data.transactionId,
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
            paymentStatus: "completed",
          },
          "Payment completed successfully"
        )
      );
    } else {
      await Order.findByIdAndUpdate(order._id, {
        "paymentDetails.status": "failed",
      });

      return res.status(400).json(
        new ApiResponse(
          400,
          {
            orderId: order._id,
            paymentStatus: "failed",
          },
          "Payment failed"
        )
      );
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
    throw new ApiError(404, "order not found");
  }

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

export { initiatePayment, getPaymentStatus, handlePaymentCallback };
