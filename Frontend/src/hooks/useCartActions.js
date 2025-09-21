import { useCallback } from 'react';
import useCart from './useCart.js';
import useToast from './useToast.js';

const useCartActions = (uiState) => {
  const { updateCartItem, removeFromCart, clearCart } = useCart();
  const { addToast } = useToast(); // 🔥 Move toast logic here
  const { 
    setError, 
    setItemUpdating, 
    setItemRemoving, 
  } = uiState;

  const handleUpdateQuantity = useCallback(async (itemId, newQuantity, currentQuantity) => {
    if (newQuantity < 1) {
      return handleRemoveItem(itemId);
    }

    try {
      setError(null);
      setItemUpdating(itemId, true);
      
      console.log(`🔄 Updating item ${itemId} quantity to ${newQuantity}`);
      
      await updateCartItem(itemId, newQuantity);
      
      // 🔥 Show success toast
      addToast('✅ Cart updated successfully!', 'success', 2000);
      
      console.log('✅ Cart item updated and refreshed');
      
    } catch (error) {
      console.error('❌ Error updating cart:', error);
      setError('Failed to update cart item');
      
      // 🔥 Show error toast
      addToast('❌ Failed to update cart', 'error', 3000);
    } finally {
      setItemUpdating(itemId, false);
    }
  }, [updateCartItem, setError, setItemUpdating, addToast]);

  const handleRemoveItem = useCallback(async (itemId) => {
    try {
      setError(null);
      setItemRemoving(itemId, true);
      
      console.log(`🔄 Removing item ${itemId}`);
      
      await removeFromCart(itemId);
      
      // 🔥 Show success toast
      addToast('🗑️ Item removed from cart', 'info', 2000);
      
      console.log('✅ Cart item removed and refreshed');
      
    } catch (error) {
      console.error('❌ Error removing item:', error);
      setError('Failed to remove item from cart');
      
      // 🔥 Show error toast
      addToast('❌ Failed to remove item', 'error', 3000);
    } finally {
      setItemRemoving(itemId, false);
    }
  }, [removeFromCart, setError, setItemRemoving, addToast]);

  const handleClearCart = useCallback(async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    try {
      setError(null);
      
      console.log('🔄 Clearing entire cart');
      
      await clearCart();
      
      // 🔥 Show success toast
      addToast('🧹 Cart cleared successfully!', 'info', 2000);
      
      console.log('✅ Cart cleared and refreshed');
      
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
      setError('Failed to clear cart');
      
      // 🔥 Show error toast
      addToast('❌ Failed to clear cart', 'error', 3000);
    }
  }, [clearCart, setError, addToast]);

  return {
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
  };
};

export default useCartActions;