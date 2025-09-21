import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Home from "../pages/Home.jsx";
import Products from "../pages/Products.jsx";
import ProductDetail from "../pages/ProductDetail.jsx";
import Cart from "../pages/Cart.jsx";
import Checkout from "../pages/Checkout.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Orders from "../pages/Orders.jsx";
import Profile from "../pages/Profile.jsx"; // ✅ Add this missing import
import PaymentSuccess from "../pages/PaymentSuccess.jsx";
import { Layout, ProtectedRoute } from "../components/index.js";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Layout />}>
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="orders/:orderId"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-6">Page not found</p>
                <button
                  onClick={() => window.history.back()}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                >
                  Go Back
                </button>
              </div>
            </div>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
