import { useContext } from "react";
import { CartContext } from "../context/cartContext.js";

export const useCart = () => {
  const context = useContext(CartContext);
  if(!context){
    throw new Error('use cart must be used within a cart provider')
  }
  return context
};
