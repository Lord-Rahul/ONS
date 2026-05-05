import { useContext } from "react";
import { useCart as useCartContext } from "../context/CartContext.jsx";
const useCart = () => {
  return useCartContext();
};

export default useCart;
