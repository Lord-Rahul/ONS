import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Cart } from "../models/cart.model.js";
import mongoose from "mongoose";
import { Product } from "../models/product.model.js";

// Validation helper for quantity
const validateQuantity = (quantity) => {
  const num = Number(quantity);
  if (!Number.isInteger(num) || num < 1 || num > 999) {
    throw new ApiError(400, "Quantity must be a number between 1 and 999");
  }
  return num;
};

// Validation helper for size
const validateSize = (size) => {
  const validSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"];
  if (!size || !validSizes.includes(size)) {
    throw new ApiError(
      400,
      `Invalid size. Must be one of: ${validSizes.join(", ")}`
    );
  }
  return size;
};

// Helper to get or create cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name mainImage price countInStock sizes clothingType",
    });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Validate cart items (handle deleted products)
    const validItems = cart.items.filter((item) => item.product);
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    return res.status(200).json(
      new ApiResponse(200, cart, "Cart data fetched successfully")
    );
  } catch (error) {
    throw new ApiError(500, `Failed to fetch cart: ${error.message}`);
  }
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, size } = req.body;
  const userId = req.user._id;

  // Validate input
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID format");
  }

  if (!size) {
    throw new ApiError(400, "Size is required");
  }

  // Validate quantity and size
  const validatedQuantity = validateQuantity(quantity);
  const validatedSize = validateSize(size);

  // Fetch product with concurrent stock check
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Find size availability
  const sizeInfo = product.sizes?.find((s) => s.size === validatedSize);

  if (!sizeInfo) {
    throw new ApiError(
      400,
      `Size ${validatedSize} is not available for this product`
    );
  }

  // Validate stock
  if (sizeInfo.stock < validatedQuantity) {
    throw new ApiError(
      400,
      `Only ${sizeInfo.stock} items available in ${validatedSize} size. Please adjust quantity.`
    );
  }

  // Get or create cart
  let cart = await getOrCreateCart(userId);

  // Find existing item
  const existingItemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId && item.size === validatedSize
  );

  // Handle existing item
  if (existingItemIndex > -1) {
    const newQuantity =
      cart.items[existingItemIndex].quantity + validatedQuantity;

    // Validate new total quantity
    if (newQuantity > sizeInfo.stock) {
      throw new ApiError(
        400,
        `Cannot add that many items. Maximum ${sizeInfo.stock} items available in ${validatedSize} size.`
      );
    }

    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item
    if (cart.items.length >= 100) {
      throw new ApiError(400, "Cart limit reached (100 items max)");
    }

    cart.items.push({
      product: productId,
      quantity: validatedQuantity,
      size: validatedSize,
      priceAtTime: product.price,
      addedAt: new Date(),
    });
  }

  // Save cart
  await cart.save();

  // Populate for response
  await cart.populate({
    path: "items.product",
    select: "name mainImage price countInStock sizes clothingType",
  });

  return res.status(200).json(
    new ApiResponse(200, cart, "Item added to cart successfully")
  );
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const userId = req.user._id;

  // Validate item ID
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid item ID format");
  }

  // Validate quantity
  const validatedQuantity = validateQuantity(quantity);

  // Fetch cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Find item
  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex === -1) {
    throw new ApiError(404, "Item not found in cart");
  }

  // Fetch product and validate stock
  const product = await Product.findById(cart.items[itemIndex].product);

  if (!product) {
    // Remove deleted product from cart
    cart.items.splice(itemIndex, 1);
    await cart.save();
    throw new ApiError(404, "Product no longer available. Item removed from cart.");
  }

  // Find size info
  const sizeInfo = product.sizes?.find(
    (s) => s.size === cart.items[itemIndex].size
  );

  if (!sizeInfo || sizeInfo.stock < validatedQuantity) {
    const available = sizeInfo?.stock || 0;
    throw new ApiError(
      400,
      `Only ${available} items available in ${cart.items[itemIndex].size} size`
    );
  }

  // Update quantity
  cart.items[itemIndex].quantity = validatedQuantity;
  await cart.save();

  // Populate for response
  await cart.populate({
    path: "items.product",
    select: "name mainImage price countInStock sizes clothingType",
  });

  return res.status(200).json(
    new ApiResponse(200, cart, "Cart item updated successfully")
  );
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  // Validate item ID
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid item ID format");
  }

  // Fetch cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Find item index
  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex === -1) {
    throw new ApiError(404, "Item not found in cart");
  }

  // Remove item
  cart.items.splice(itemIndex, 1);
  await cart.save();

  // Populate for response
  await cart.populate({
    path: "items.product",
    select: "name mainImage price countInStock sizes clothingType",
  });

  return res.status(200).json(
    new ApiResponse(200, cart, "Item removed from cart successfully")
  );
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    const itemCount = cart.items.length;
    cart.items = [];
    await cart.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        cart,
        `Cart cleared successfully (${itemCount} items removed)`
      )
    );
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw new ApiError(500, `Failed to clear cart: ${error.message}`);
  }
});

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
