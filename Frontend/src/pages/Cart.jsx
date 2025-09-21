import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import useCart from "../hooks/useCart.js";
import useCartUI from "../hooks/useCartUI.js";
import useCartActions from "../hooks/useCartActions.js";
import useToast from "../hooks/useToast.js";
import CartItem from "../components/cart/CartItem.jsx";
import OrderSummary from "../components/orderSummary.jsx";
import ErrorMessage from "../components/cart/ErrorMessage.jsx";
import ToastContainer from "../components/ToastContainer.jsx";

const Cart = () => {
  const { items, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const { toasts, removeToast } = useToast();

  // Custom hooks for state management
  const uiState = useCartUI(items);
  const actions = useCartActions(uiState);

  const {
    error,
    totals,
    clearError,
    isItemUpdating,
    isItemRemoving,
  } = uiState;

  const { handleUpdateQuantity, handleRemoveItem, handleClearCart } = actions;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            <span className="ml-4 text-gray-600">Loading your cart...</span>
          </div>
        </div>
      </div>
    );
  }

  // Authentication check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M8 11h8l1 9H7l1-9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-light text-black mb-4">
            Please Sign In
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your cart
          </p>
          <Link
            to="/login"
            className="bg-black text-white px-6 py-3 font-light tracking-wide hover:bg-gray-800 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mb-8">
              <svg
                className="w-24 h-24 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M8 11h8l1 9H7l1-9z"
                />
              </svg>
            </div>
            <div className="w-24 h-px bg-black mx-auto mb-8"></div>
            <h1 className="text-4xl font-light text-black mb-6">Your Cart</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your cart is currently empty
            </p>
            <Link
              to="/products"
              className="inline-flex items-center bg-black text-white px-8 py-4 font-light tracking-wide hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* 🔥 Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-px bg-black mx-auto mb-8"></div>
          <h1 className="text-4xl font-light text-black mb-4">Shopping Cart</h1>
          <p className="text-gray-600">
            {totals.itemCount}{" "}
            {totals.itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {/* Error Message */}
        <ErrorMessage error={error} onDismiss={clearError} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Clear Cart Button */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-600">
                {totals.itemCount} items
              </span>
              <button
                onClick={handleClearCart}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Clear Cart
              </button>
            </div>

            {/* Cart Items List */}
            {items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                isUpdating={isItemUpdating(item._id)}
                isRemoving={isItemRemoving(item._id)}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          {/* Order Summary */}
          <OrderSummary totals={totals} />
        </div>
      </div>
    </div>
  );
};

export default Cart;
