/**
 * Input Validation Utilities
 * Provides reusable validation functions for common input types
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleaned = String(phone).replace(/\D/g, "");
  return phoneRegex.test(cleaned);
};

export const validatePincode = (pincode) => {
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(String(pincode));
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateMongoId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const validateQuantity = (quantity) => {
  const num = Number(quantity);
  return Number.isInteger(num) && num > 0 && num < 1000;
};

export const validatePrice = (price) => {
  const num = Number(price);
  return !isNaN(num) && num > 0;
};

export const sanitizeString = (str) => {
  if (typeof str !== "string") return "";
  return str
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .slice(0, 1000); // Limit length
};

export const sanitizeEmail = (email) => {
  return sanitizeString(email).toLowerCase();
};

export const validateAddressInput = (address) => {
  const errors = [];

  if (!address.fullName || address.fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters");
  }

  if (!validatePhoneNumber(address.phone)) {
    errors.push("Invalid phone number");
  }

  if (!validateEmail(address.email)) {
    errors.push("Invalid email address");
  }

  if (!address.address1 || address.address1.trim().length < 5) {
    errors.push("Address must be at least 5 characters");
  }

  if (!address.city || address.city.trim().length < 2) {
    errors.push("City must be at least 2 characters");
  }

  if (!validatePincode(address.pincode)) {
    errors.push("Invalid pincode (must be 6 digits)");
  }

  if (!address.state || address.state.trim().length < 2) {
    errors.push("State is required");
  }

  return errors;
};

export const validateProductInput = (product) => {
  const errors = [];

  if (
    !product.name ||
    typeof product.name !== "string" ||
    product.name.trim().length < 3
  ) {
    errors.push("Product name must be at least 3 characters");
  }

  if (
    !product.description ||
    typeof product.description !== "string" ||
    product.description.trim().length < 10
  ) {
    errors.push("Product description must be at least 10 characters");
  }

  if (!product.price || !validatePrice(product.price)) {
    errors.push("Product price must be a positive number");
  }

  if (!product.category) {
    errors.push("Category is required");
  }

  if (!product.clothingType) {
    errors.push("Clothing type is required");
  }

  return errors;
};

export const validateCartItem = (item) => {
  const errors = [];

  if (!item.productId) {
    errors.push("Product ID is required");
  }

  if (!item.size) {
    errors.push("Size is required");
  }

  if (!validateQuantity(item.quantity)) {
    errors.push("Quantity must be between 1 and 999");
  }

  return errors;
};

export const validateCheckoutData = (checkout) => {
  const errors = [];

  if (!checkout.items || checkout.items.length === 0) {
    errors.push("Cart must have at least one item");
  }

  if (!checkout.shippingAddress) {
    errors.push("Shipping address is required");
  } else {
    const addressErrors = validateAddressInput(checkout.shippingAddress);
    errors.push(...addressErrors);
  }

  if (!checkout.paymentMethod) {
    errors.push("Payment method is required");
  }

  return errors;
};

/**
 * Batch validation - returns first error or null
 */
export const getFirstValidationError = (...errorArrays) => {
  for (const errors of errorArrays) {
    if (Array.isArray(errors) && errors.length > 0) {
      return errors[0];
    }
  }
  return null;
};
