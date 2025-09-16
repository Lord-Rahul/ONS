import React, { useState } from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import { AuthProvider } from "./context/authContext.js";
import { CartProvider } from "./context/cartContext.js";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
