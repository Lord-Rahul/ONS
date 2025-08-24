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

export { getCart };
