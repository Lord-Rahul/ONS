import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-md w-full text-center">
        {/* 404 Image/Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-light text-gray-200 mb-2">404</div>
          <img 
            src="https://images.unsplash.com/photo-1434536173152-8550a1f17f92?w=400&h=300&fit=crop"
            alt="Page not found"
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        </div>

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-black mb-4">Page Not Found</h1>
          <div className="w-16 h-px bg-black mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            We couldn't find the page you're looking for. It might have been moved or no longer exists. Let's get you back on track.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full px-6 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-900 transition-all duration-500"
          >
            Go to Home
          </Link>
          <Link
            to="/products"
            className="block w-full px-6 py-3 border border-black text-black font-light tracking-wide hover:bg-black hover:text-white transition-all duration-500"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 font-light mb-4">Popular Pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/" className="text-xs text-gray-600 hover:text-black font-light underline">
              Home
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/products" className="text-xs text-gray-600 hover:text-black font-light underline">
              Products
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/contact" className="text-xs text-gray-600 hover:text-black font-light underline">
              Contact
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/about" className="text-xs text-gray-600 hover:text-black font-light underline">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
