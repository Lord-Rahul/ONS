import { useCallback } from 'react';
import useCart from './useCart.js';

const useCartActions = (uiState) => {
  const { updateCartItem, removeFromCart, clearCart } = useCart();
  const { 
    setError, 
    setItemUpdating, 
    setItemRemoving, 
    updateLocalQuantity, 
    revertQuantity 
  } = uiState;

  const handleUpdateQuantity = useCallback(async (itemId, newQuantity, currentQuantity) => {
    if (newQuantity < 1) {
      return handleRemoveItem(itemId);
    }

    try {
      setError(null);
      
   
      setItemUpdating(itemId, true);
      

      await updateCartItem(itemId, newQuantity);
      

      console.log('✅ Cart item updated successfully');
      
    } catch (error) {
      console.error('❌ Error updating cart:', error);
      setError('Failed to update cart item');
      
    } finally {

      setItemUpdating(itemId, false);
    }
  }, [updateCartItem, setError, setItemUpdating]);

  const handleRemoveItem = useCallback(async (itemId) => {
    try {
      setError(null);
      

      setItemRemoving(itemId, true);
      

      await removeFromCart(itemId);
      

      console.log('✅ Cart item removed successfully');
      
    } catch (error) {
      console.error('❌ Error removing item:', error);
      setError('Failed to remove item from cart');
    } finally {
      setItemRemoving(itemId, false);
    }
  }, [removeFromCart, setError, setItemRemoving]);

  const handleClearCart = useCallback(async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    try {
      setError(null);
      
     
      console.log('🔄 Clearing cart...');
      
      await clearCart();
      
      console.log('✅ Cart cleared successfully');
      
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
      setError('Failed to clear cart');
    }
  }, [clearCart, setError]);

  return {
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
  };
};

export default useCartActions;