import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/apiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { sendOrderConfirmationEmail } from "../services/email.service.js";


const placeOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  const userId = req.user._id;

  console.log('📦 Received order data:', { items, shippingAddress, paymentMethod });

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Order items are required");
  }

  if (!shippingAddress) {
    throw new ApiError(400, "Shipping address is required");
  }

  // Validate shipping address fields
  const requiredAddressFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
  for (const field of requiredAddressFields) {
    if (!shippingAddress[field] || shippingAddress[field].trim() === '') {
      throw new ApiError(400, `${field} is required in shipping address`);
    }
  }

  if (!paymentMethod) {
    throw new ApiError(400, "Payment method is required");
  }

  // Get user's cart
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new ApiError(
      400,
      "Cart is empty. Add items to cart before placing order"
    );
  }

  const orderItems = [];
  let itemsSubtotal = 0;

  for (const cartItem of cart.items) {
    const product = cartItem.product;

    if (!product) {
      throw new ApiError(400, ` Product not found for item in cart`);
    }

    const sizeInfo = product.sizes.find((s) => s.size === cartItem.size);

    if (!sizeInfo || sizeInfo.stock < cartItem.quantity) {
      throw new ApiError(
        400,
        `Insufficient stock for ${product.name} in size ${cartItem.size}`
      );
    }

    const itemSubtotal = product.price * cartItem.quantity;
    itemsSubtotal += itemSubtotal;

    orderItems.push({
      product: product._id,
      productSnapshot: {
        name: product.name,
        mainImage: product.mainImage,
        clothingType: product.clothingType,
      },
      quantity: cartItem.quantity,
      size: cartItem.size,
      color: product.colors?.[0] || "",
      priceAtOrder: product.price,
      itemSubtotal: itemSubtotal,
    });
  }

  const shippingCharges = itemsSubtotal >= 999 ? 0 : 50;

  const taxAmount = Math.round(itemsSubtotal * 0.02); //2% tax

  const totalAmount = itemsSubtotal + shippingCharges + taxAmount;

  const order = await Order.create({
    user: userId,
    items: orderItems,
    itemsSubtotal,
    shippingCharges,
    taxAmount,
    discountAmount: 0,
    totalAmount,
    shippingAddress,
    paymentDetails: {
      method: paymentMethod,
      status: paymentMethod === "COD" ? "pending" : "pending",
    },
    status: "pending",
  });

  for (const cartItem of cart.items) {
    const product = cartItem.product;
    const sizeIndex = product.sizes.findIndex((s) => s.size === cartItem.size);

    if (sizeIndex !== -1) {
      product.sizes[sizeIndex].stock -= cartItem.quantity;
      product.countInStock = product.sizes.reduce(
        (total, size) => total + size.stock,
        0
      );
      await product.save();
    }
  }

  cart.items = [];
  await cart.save();

  await order.populate("user", "fullName email phone ");
  await sendOrderConfirmationEmail(order)

  return res
    .status(201)
    .json(new ApiResponse(201, order, "order placed successfully "));
});

const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, status } = req.query;

  const filter = { user: userId };
  if (status && status !== "all") {
    filter.status = status;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const orders = await Order.find(filter)
    .populate("items.product", "name mainImage clothingType")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const totalOrders = await Order.countDocuments(filter);
  const totalPages = Math.ceil(totalOrders / Number(limit));

  const paginationInfo = {
    currentPage: Number(page),
    totalPages,
    totalOrders,
    hasNextPage: Number(page) < totalPages,
    hasPrevPage: Number(page) > 1,
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        pagination: paginationInfo,
      },
      "Orders fetched successfully"
    )
  );
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const order = await Order.findOne({ _id: id, user: userId })
    .populate("items.product", "name mainImage clothingType brand")
    .populate("user", "fullName email phone");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, trackingNumber } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "invalid order id ");
  }

  const validStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "returned",
    "refunded",
  ];

  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, "invalid order status");
  }

  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, "Order not found ");
  }

  const updateData = { status };

  switch (status) {
    case "confirmed":
      updateData.confirmedAt = new Date();
      break;
    case "shipped":
      updateData.shippedAt = new Date();
      if (trackingNumber) updateData.trackingNumber = trackingNumber;
      break;
    case "delivered":
      updateData.deliveredAt = new Date();
      updateData.actualDeliveryDate = new Date();
      break;
    case "cancelled":
      updateData.cancelledAt = new Date();
      break;
  }

  const updateOrder = await Order.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("user", "fullName email phone")
    .populate("items.product", "name mainImage clothingType");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updateOrder, `Order status updated to ${status}`)
    );
});

const requestCancellation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cancellationReason } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400,"invalid order ID");
  }

  const order = await Order.findOne({ _id: id, user: userId });
  if (!order) {
    throw new ApiError(404, "order not found ");
  }


  const cancellationStatuses = ["pending", "confirmed", "processing"];
  if (!cancellationStatuses.includes(order.status)) {
    throw new ApiError(
      400,
      `cannot request cancellation for order with status ${order.status}`
    );
  }

  const updateData = {
  status: "cancellation_requested",
  cancellationReason: cancellationReason || "Customer requested cancellation",
};

  const updateOrder = await Order.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("user", "fullName email phone ")
    .populate("items.product", "name mainImage clothingType");


    return res
    .status(200)
    .json(new ApiResponse(200, updateOrder, "cancellation request submitted succesfully"))

});


export { placeOrder, getUserOrders, getOrderById, updateOrderStatus,requestCancellation };
