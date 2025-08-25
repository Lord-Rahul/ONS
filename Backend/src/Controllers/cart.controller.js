import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Cart } from "../models/cart.model.js";
import mongoose from "mongoose";
import { Product } from "../models/product.model.js";

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "name mainImage price countInStock sizes clothingType",
  });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "cart data fetched successfully "));
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, size } = req.body;
  const userId = req.user._id;

  if (!productId) {
    throw new ApiError(400, "Product ID and size is required");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const sizeInfo = product.sizes.find((s) => s.size === size);o

  if (!sizeInfo) {
    throw new ApiError(400, "selected size not available");
  }

  if (sizeInfo.stock < quantity) {
    throw new ApiError(
      400,
      `only ${sizeInfo.stock} items available in ${size} size `
    );
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId && item.size === size
  );

  if (existingItemIndex > -1) {
    const newQuantity =
      cart.items[existingItemIndex].quantity + Number(quantity);

    if (newQuantity > sizeInfo.stock) {
      throw new ApiError(
        400,
        `Cannot add more. only ${sizeInfo.stock} items available in ${size} size }`
      );
    }

    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    cart.items.push({
      product: productId,
      quantity: Number(quantity),
      size,
      priceAtTime: product.price,
    });
  }

  await cart.save();

  await cart.populate({
    path: "items.product",
    select: "name mainImage price countInStock sizes clothingType",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "item added to cart successfully "));
});

export { getCart, addToCart };
