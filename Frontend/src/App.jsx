import React from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import ToastContainer from "./components/ToastContainer.jsx";
import useToast from "./hooks/useToast.js";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppWithToasts />
      </CartProvider>
    </AuthProvider>
  );
}

// 🔥 Separate component to use hooks
const AppWithToasts = () => {
  const { toasts, removeToast } = useToast();
  
  return (
    <>
      <AppRoutes />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default App;
