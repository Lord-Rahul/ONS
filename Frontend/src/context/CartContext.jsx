import React, { createContext, useContext, useReducer, useEffect } from 'react';
import cartService from '../services/cartService.js';
import { useAuth } from './AuthContext.jsx';
import useToast from '../hooks/useToast.js';

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
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  ADD_ITEM_SUCCESS: "ADD_ITEM_SUCCESS",
};

const initialState = {
  cart: null,
  items: [],
  count: 0,
  total: 0,
  loading: false,
  error: null,
};

// ✅ Safe function to extract items array from cart data
const extractItems = (cartData) => {
  console.log('🔍 Extracting items from cart data:', cartData);
  
  if (!cartData) {
    console.log('❌ No cart data provided');
    return [];
  }
  
  // Handle different possible structures
  if (Array.isArray(cartData)) {
    console.log('✅ Cart data is already an array');
    return cartData;
  }
  
  if (cartData.items && Array.isArray(cartData.items)) {
    console.log('✅ Found items array in cart data');
    return cartData.items;
  }
  
  if (cartData.cart && cartData.cart.items && Array.isArray(cartData.cart.items)) {
    console.log('✅ Found items array in nested cart object');
    return cartData.cart.items;
  }
  
  console.log('❌ Could not find items array, returning empty array');
  return [];
};

const calculateTotal = (items) => {
  if (!Array.isArray(items)) {
    console.log('⚠️ calculateTotal received non-array:', items);
    return 0;
  }
  
  return items.reduce((total, item) => {
    const price = item.product?.price || item.price || 0;
    const quantity = item.quantity || 0;
    return total + (price * quantity);
  }, 0);
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART_START:
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload !== undefined ? action.payload : true,
        error: null,
      };

    case CART_ACTIONS.LOAD_CART_SUCCESS:
      const items = extractItems(action.payload);
      console.log('✅ Cart reducer - extracted items:', items);
      
      return {
        ...state,
        cart: action.payload,
        items,
        count: items.length,
        total: calculateTotal(items),
        loading: false,
        error: null,
      };

    case CART_ACTIONS.LOAD_CART_ERROR:
    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CART_ACTIONS.ADD_ITEM_SUCCESS:
      const updatedItems = extractItems(action.payload);
      return {
        ...state,
        cart: action.payload,
        items: updatedItems,
        count: updatedItems.length,
        total: calculateTotal(updatedItems),
        loading: false,
        error: null,
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: null,
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

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();

  // Create a loadCart function that can be reused
  const loadCart = async () => {
    if (!isAuthenticated || !user) {
      console.log('👤 User not authenticated, skipping cart load');
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
      return;
    }

    try {
      dispatch({ type: CART_ACTIONS.LOAD_CART_START });
      console.log('📥 Loading cart for authenticated user...');
      
      const response = await cartService.getCart();
      console.log('🔍 Cart service response:', response);
      
      if (response.success) {
        dispatch({ type: CART_ACTIONS.LOAD_CART_SUCCESS, payload: response.data });
        console.log('✅ Cart loaded successfully');
      } else {
        throw new Error(response.message || 'Failed to load cart');
      }
    } catch (error) {
      console.log('❌ Cart load error:', error);
      
      // Don't show error for unauthorized - user might not have cart yet
      if (error.response?.status !== 401) {
        dispatch({ type: CART_ACTIONS.LOAD_CART_ERROR, payload: 'Failed to load cart' });
      } else {
        console.log('🔓 No cart found or unauthorized - initializing empty cart');
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
      }
    }
  };

  // Load cart when user is authenticated
  useEffect(() => {
    loadCart();
  }, [isAuthenticated, user]);

  const addToCart = async (item) => {
    if (!isAuthenticated) {
      addToast('Please login to add items to cart', 'warning');
      return false;
    }

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      console.log('🔄 Adding to cart:', item);
      
      const response = await cartService.addToCart(item);
      console.log('🔍 Add to cart response:', response);
      
      if (response.success) {
        dispatch({ type: CART_ACTIONS.ADD_ITEM_SUCCESS, payload: response.data });
        addToast('Item added to cart successfully! 🛒', 'success');
        return true;
      } else {
        throw new Error(response.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.log('❌ Add to cart error:', error);
      
      let errorMessage = 'Failed to add item to cart';
      
      if (error.response?.status === 401) {
        errorMessage = 'Please login to add items to cart';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      addToast(errorMessage, 'error');
      return false;
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      console.log('🔄 Updating cart item:', itemId, 'to quantity:', quantity);
      await cartService.updateCartItem(itemId, quantity);
      
      // Refresh cart after update
      await loadCart();
      
      return { success: true };
    } catch (error) {
      console.error('❌ Update cart error:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      console.log('🔄 Removing cart item:', itemId);
      await cartService.removeFromCart(itemId);
      
      // Refresh cart after removal
      await loadCart();
      
      return { success: true };
    } catch (error) {
      console.error('❌ Remove from cart error:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      console.log('🔄 Clearing cart');
      await cartService.clearCart();
      
      // Refresh cart after clearing
      await loadCart();
      
      return { success: true };
    } catch (error) {
      console.error('❌ Clear cart error:', error);
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

  // ✅ Fixed getCartSummary to use state.items instead of state.cart.items
  const getCartSummary = () => {
    const items = state.items || [];
    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const subtotal = calculateTotal(items);
    const shippingCost = subtotal >= 999 ? 0 : 99;
    const finalTotal = subtotal + shippingCost;

    return {
      totalItems,
      subtotal,
      shippingCost,
      finalTotal
    };
  };

  const value = {
    cart: state.cart,
    items: state.items, // ✅ Expose items directly
    count: state.count,
    total: state.total,
    isLoading: state.loading,
    error: state.error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartSummary,
    loadCart, // ✅ Expose loadCart for manual refresh
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
