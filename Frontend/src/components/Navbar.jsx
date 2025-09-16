import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Heart, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import useCart from "../hooks/useCart.js";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
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
                <p className="text-xs text-gray-600">North Indian Fashion</p>
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
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-red-600"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden sm:block text-sm">
                      {user?.name}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm">Login</span>
                </Link>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="hidden md:flex space-x-8 py-3 border-t">
          <Link
            to="/products"
            className="text-gray-700 hover:text-red-600 font-medium"
          >
            All Products
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-700 hover:text-red-600 font-medium"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Link
                to="/products"
                className="block py-2 text-gray-700 hover:text-red-600"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block py-2 text-gray-700 hover:text-red-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
