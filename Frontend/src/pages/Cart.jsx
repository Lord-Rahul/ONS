import React from "react";
import useCart from "../hooks/useCart.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

const Cart = () => {
  const { items, loading, removeFromCart, updateCartItem, clearCart, total } =
    useCart();
  const { isAuthenticated } = useAuth();

  // Add error boundary
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Clear any previous errors when component mounts
    setError(null);
  }, []);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      setError(null);
      if (newQuantity <= 0) {
        await removeFromCart(itemId);
      } else {
        await updateCartItem(itemId, newQuantity);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      setError("Failed to update cart item");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setError(null);
      await removeFromCart(itemId);
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Failed to remove item from cart");
    }
  };

  // Add error display
  if (error) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-light text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => setError(null)}
              className="bg-black text-white px-6 py-3 font-light tracking-wide hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="w-24 h-px bg-black mx-auto mb-8"></div>
        <h1 className="text-4xl font-light text-black text-center mb-12">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      item.product?.mainImage?.url ||
                      item.product?.images?.[0]?.url ||
                      item.product?.image ||
                      "/placeholder.jpg"
                    }
                    alt={item.product?.name || "Product"}
                    className="w-20 h-20 object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-light text-black">
                      {item.product?.name || "Unknown Product"}
                    </h3>
                    <p className="text-gray-600">
                      ₹{item.product?.price?.toLocaleString() || "0"}
                    </p>
                    {item.size && (
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                    )}
                    {item.color && (
                      <p className="text-sm text-gray-500">Color: {item.color}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item._id, item.quantity - 1)
                      }
                      className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item._id, item.quantity + 1)
                      }
                      className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-600 hover:text-red-800 ml-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 shadow-sm border border-gray-200 h-fit">
            <h3 className="text-xl font-light text-black mb-6">
              Order Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-medium">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-black text-white py-3 px-6 text-center block mt-6 font-light tracking-wide hover:bg-gray-800 transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
