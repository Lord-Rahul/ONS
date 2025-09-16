import { useContext } from "react";
import CartContext from "../context/CartContext.jsx";
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("use cart must be used within a cart provider");
  }
  return context;
};

export default useCart;
