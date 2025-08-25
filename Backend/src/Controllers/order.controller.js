import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/apiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = "PhonePe" } = req.body;

  const userId = req.user._id;

  if (
    !shippingAddress ||
    !shippingAddress.fullName ||
    !shippingAddress.phone ||
    !shippingAddress.address1 ||
    !shippingAddress.city ||
    !shippingAddress.state ||
    !shippingAddress.pincode
  ) {
    throw new ApiError(400, "fill required fields ");
  }

  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new ApiError(
      400,
      "Cart is empty. Add items to cart before placing order "
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

  return res
    .status(201)
    .json(new ApiResponse(201, order, "order placed successfully "));
});

export { placeOrder };
