import React, { useContext, useReducer, useEffect, createContext } from "react";
import cartService from "../services/cartService.js";
import { useAuth } from "./authContext.js";

const CartContext = createContext();

const CART_ACTIONS = {
  LOAD_CART_START: "LOAD_CART_START",
  LOAD_CART_SUCCESS: "LOAD_CART_SUCCESS",
  LOAD_CART_ERROR: "LOAD_CART_ERROR",
  ADD_TO_CART: "ADD_TO_CART",
  UPDATE_CART_ITEM: "UPDATE_CART_ITEM",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  CLEAR_CART: "CLEAR_CART",
  SET_CART_COUNT: "SET_CART_COUNT",
};

const initialState = {
  items: [],
  count: 0,
  total: 0,
  loading: false,
  error: null,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CART_ACTIONS.LOAD_CART_SUCCESS:
      const items = action.payload || [];
      return {
        ...state,
        items,
        count: items.length,
        total: calculateTotal(items),
        loading: false,
        error: null,
      };

    case CART_ACTIONS.LOAD_CART_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CART_ACTIONS.ADD_TO_CART:
      const newItems = [...state.items, action.payload];
      return {
        ...state,
        items: newItems,
        count: newItems.length,
        total: calculateTotal(newItems),
      };

    case CART_ACTIONS.UPDATE_CART_ITEM:
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };

    case CART_ACTIONS.REMOVE_FROM_CART:
      const filteredItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      return {
        ...state,
        items: filteredItems,
        count: filteredItems.length,
        total: calculateTotal(filteredItems),
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        count: 0,
        total: 0,
      };

    case CART_ACTIONS.SET_CART_COUNT:
      return {
        ...state,
        count: action.payload,
      };

    default:
      return state;
  }
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.LOAD_CART_START });
      const response = await cartService.getCart();
      dispatch({
        type: CART_ACTIONS.LOAD_CART_SUCCESS,
        payload: response.data?.items || [],
      });
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.LOAD_CART_ERROR,
        payload: error.message || "Failed to load Cart",
      });
    }
  };

  const addToCart = async (productData) => {
    try {
      const response = await cartService.addToCart(productData);
      dispatch({
        type: CART_ACTIONS.ADD_TO_CART,
        payload: response.data,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateCartItem = async (itemId, updateData) => {
    try {
      const response = await cartService.updateCartItem(itemId, updateData);
      dispatch({
        type: CART_ACTIONS.UPDATE_CART_ITEM,
        payload: response.data,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartService.removeFromCart(itemId);
      dispatch({
        type: CART_ACTIONS.REMOVE_FROM_CART,
        payload: itemId,
      });
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      dispatch({
        type: CART_ACTIONS.CLEAR_CART,
      });
    } catch (error) {
      throw error;
    }
  };

  const getCartCount = async () => {
    try {
      const count = await cartService.getCartCount();
      dispatch({
        type: CART_ACTIONS.SET_CART_COUNT,
        payload: count,
      });
      return count;
    } catch (error) {
      return 0;
    }
  };

  const value = {
    ...state,
    loadCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
export default CartContext;
