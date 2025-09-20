import { useState, useEffect, useMemo, useCallback } from 'react';

const useCartUI = (items = []) => {
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [removingItems, setRemovingItems] = useState(new Set());
  const [localQuantities, setLocalQuantities] = useState({});

  // Initialize local quantities when items change
  useEffect(() => {
    if (items && items.length > 0) {
      const quantities = {};
      items.forEach((item) => {
        quantities[item._id] = item.quantity;
      });
      setLocalQuantities(quantities);
    } else {
      setLocalQuantities({});
    }
  }, [items]);

  // Clear error when items change
  useEffect(() => {
    setError(null);
  }, [items]);

  // Calculate totals
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
      const quantity = localQuantities[item._id] || item.quantity;
      return sum + (item.product?.price || 0) * quantity;
    }, 0);

    const tax = Math.round(subtotal * 0.18); // 18% GST
    const shipping = subtotal > 999 ? 0 : 99; // Free shipping over ₹999
    const total = subtotal + tax + shipping;
    const itemCount = items.reduce((count, item) => {
      return count + (localQuantities[item._id] || item.quantity);
    }, 0);

    return { subtotal, tax, shipping, total, itemCount };
  }, [items, localQuantities]);

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

  const updateLocalQuantity = useCallback((itemId, quantity) => {
    setLocalQuantities(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  }, []);

  const revertQuantity = useCallback((itemId, originalQuantity) => {
    setLocalQuantities(prev => ({
      ...prev,
      [itemId]: originalQuantity
    }));
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

  const getItemQuantity = useCallback((itemId, defaultQuantity) => {
    return localQuantities[itemId] || defaultQuantity;
  }, [localQuantities]);

  return {
    error,
    setError,
    totals,
    setItemUpdating,
    setItemRemoving,
    updateLocalQuantity,
    revertQuantity,
    clearError,
    isItemUpdating,
    isItemRemoving,
    getItemQuantity,
  };
};

export default useCartUI;