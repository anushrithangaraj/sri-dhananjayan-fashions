// frontend/src/services/cartService.js
import api from './api';

export const cartService = {
    // Get user's cart
    getCart: async () => {
        const response = await api.get('/cart');
        return response.data;
    },

    // Add item to cart
    addToCart: async (productId, quantity = 1, selectedSize = null, selectedColor = null) => {
        const response = await api.post('/cart', {
            productId,
            quantity,
            selectedSize,
            selectedColor
        });
        return response.data;
    },

    // Update cart item quantity
    updateCartItem: async (productId, quantity, selectedSize = null, selectedColor = null) => {
        const response = await api.put(`/cart/${productId}`, {
            quantity,
            selectedSize,
            selectedColor
        });
        return response.data;
    },

    // Remove item from cart
    removeFromCart: async (productId, selectedSize = null, selectedColor = null) => {
        const response = await api.delete(`/cart/${productId}`, {
            params: { selectedSize, selectedColor }
        });
        return response.data;
    },

    // Clear cart
    clearCart: async () => {
        const response = await api.delete('/cart');
        return response.data;
    }
};