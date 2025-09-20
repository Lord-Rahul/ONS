import React from 'react';
import { Link } from 'react-router-dom';

const OrderSummary = ({ totals }) => {
  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-lg h-fit sticky top-20">
      <h3 className="text-xl font-light text-black mb-6 border-b pb-3">
        Order Summary
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({totals.itemCount} items)</span>
          <span>₹{totals.subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tax (GST 18%)</span>
          <span>₹{totals.tax.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <div className="flex flex-col">
            <span>Shipping</span>
            {totals.shipping === 0 && (
              <span className="text-xs text-green-600">Free shipping applied!</span>
            )}
          </div>
          <span>
            {totals.shipping === 0 ? 'Free' : `₹${totals.shipping}`}
          </span>
        </div>

        {totals.subtotal < 999 && totals.subtotal > 0 && (
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-xs text-blue-700">
              Add ₹{(999 - totals.subtotal).toLocaleString()} more for free shipping!
            </p>
          </div>
        )}

        <div className="border-t pt-4 flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>₹{totals.total.toLocaleString()}</span>
        </div>
      </div>

      <Link
        to="/checkout"
        className="w-full bg-black text-white py-3 px-6 text-center block mt-6 font-light tracking-wide hover:bg-gray-800 transition-colors"
      >
        Proceed to Checkout
      </Link>

      <Link
        to="/products"
        className="w-full border border-gray-300 text-gray-700 py-3 px-6 text-center block mt-3 font-light tracking-wide hover:bg-gray-50 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSummary;