import { useState, useEffect, useMemo, useCallback } from 'react';

const useCartUI = (items = []) => {
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [removingItems, setRemovingItems] = useState(new Set());

  // Clear error when items change
  useEffect(() => {
    setError(null);
  }, [items]);

  // 🔥 Calculate totals using actual cart items only
  const totals = useMemo(() => {
    if (!items || items.length === 0) {
      return {
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        itemCount: 0,
      };
    }

    const subtotal = items.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    const tax = Math.round(subtotal * 0.18); // 18% GST
    const shipping = subtotal > 999 ? 0 : 99; // Free shipping over ₹999
    const total = subtotal + tax + shipping;
    const itemCount = items.reduce((count, item) => {
      return count + item.quantity;
    }, 0);

    return { subtotal, tax, shipping, total, itemCount };
  }, [items]);

  // UI State Management Functions
  const setItemUpdating = useCallback((itemId, isUpdating) => {
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      if (isUpdating) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  }, []);

  const setItemRemoving = useCallback((itemId, isRemoving) => {
    setRemovingItems(prev => {
      const newSet = new Set(prev);
      if (isRemoving) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isItemUpdating = useCallback((itemId) => {
    return updatingItems.has(itemId);
  }, [updatingItems]);

  const isItemRemoving = useCallback((itemId) => {
    return removingItems.has(itemId);
  }, [removingItems]);

  // 🔥 Just return the actual cart quantity - no local state needed
  const getItemQuantity = useCallback((itemId, defaultQuantity) => {
    return defaultQuantity; // Return the actual cart quantity
  }, []);

  return {
    error,
    setError,
    totals,
    setItemUpdating,
    setItemRemoving,
    clearError,
    isItemUpdating,
    isItemRemoving,
    getItemQuantity,
  };
};

export default useCartUI;