import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Heart, Menu, X } from "lucide-react";
import { useAuth } from "../context/authContext.js";
import useCart from "../hooks/useCart.js";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, layout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Sarees", path: "/products?category=sarees" },
    { name: "Suits", path: "/products?category=suits" },
    { name: "Lehengas", path: "/products?category=lehengas" },
    { name: "Dupattas", path: "/products?category=dupattas" },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>
            🎉 Festive Sale: Up to 50% Off on Traditional Wear | Free Shipping
            Above ₹999
          </p>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-lg">
                <span className="text-xl font-bold">ONS</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-800">
                  ONS Store
                </span>
                <p className="text-xs text-gray-600">North Indian Fashioned</p>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for sarees, suits, lehengas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="md:hidden p-2 text-gray-600 hover:text-red-600">
              <Search className="h-5 w-5" />
            </button>

            <Link
              to="/wishlist"
              className="p-2 text-gray-600 hover:text-red-600 relative"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <Link
              to="/cart"
              className="p-2 text-gray-600 hover:text-red-600 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
