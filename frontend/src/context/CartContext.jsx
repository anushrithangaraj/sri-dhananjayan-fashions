// frontend/src/context/CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load cart from database when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      setGstAmount(0);
    }
  }, [isAuthenticated, user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCartItems(cartData.items || []);
      setCartCount(cartData.totalItems || 0);
      setCartTotal(cartData.totalPrice || 0);
      setGstAmount(cartData.gstAmount || 0);
    } catch (error) {
      console.error('Error loading cart:', error);
      // Don't show error toast for cart loading failures
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      setLoading(true);
      const cartData = await cartService.addToCart(
        product._id,
        quantity,
        selectedSize,
        selectedColor
      );

      setCartItems(cartData.items || []);
      setCartCount(cartData.totalItems || 0);
      setCartTotal(cartData.totalPrice || 0);
      setGstAmount(cartData.gstAmount || 0);

      toast.success('Item added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId, size, color) => {
    try {
      setLoading(true);
      const cartData = await cartService.removeFromCart(itemId, size, color);

      setCartItems(cartData.items || []);
      setCartCount(cartData.totalItems || 0);
      setCartTotal(cartData.totalPrice || 0);
      setGstAmount(cartData.gstAmount || 0);

      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, size, color, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setLoading(true);
      const cartData = await cartService.updateCartItem(itemId, newQuantity, size, color);

      setCartItems(cartData.items || []);
      setCartCount(cartData.totalItems || 0);
      setCartTotal(cartData.totalPrice || 0);
      setGstAmount(cartData.gstAmount || 0);
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error(error.response?.data?.message || 'Failed to update item quantity');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartService.clearCart();

      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      setGstAmount(0);

      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    gstAmount,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};