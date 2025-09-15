import React, { useContext, useReducer, useEffect, createContext } from "react";
import cartService from "../services/cartService.js";
import { useAuth } from "./authContext.js";

const cartContext = createContext();

const CART_ACTIONS = {
  LOAD_CART_START: "LOAD_CART_START",
  LOAD_CART_SUCESS: "LOAD_CART_SUCESS",
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

    case CART_ACTIONS.LOAD_CART_SUCESS:
      const items = action.payload || [];
      return {
        ...state,
        items,
        count: items.length,
        total: calculateTotal(items),
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
      const updatedItems = state.items.map((item) => {
        item.id === action.payload.id ? action.payload : item;
      });
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };

    case CART_ACTIONS.REMOVE_FROM_CART:
      const filteredItems = state.items.filter(
        (item) => item.id != action.payload
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
