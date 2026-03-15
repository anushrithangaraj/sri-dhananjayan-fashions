// frontend/src/services/orderService.js
import api from './api';

export const orderService = {
    // Create new order
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    // Get order by ID
    getOrderById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    // Get user's orders
    getUserOrders: async () => {
        const response = await api.get('/orders/myorders');
        return response.data;
    },

    // Get all orders (admin)
    getAllOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    },

    // Update order status (admin)
    updateOrderStatus: async (id, status) => {
        const response = await api.put(`/orders/${id}/status`, { status });
        return response.data;
    },

    // Cancel order (user)
    cancelOrder: async (id) => {
        const response = await api.put(`/orders/${id}/cancel`);
        return response.data;
    },

    // Delete cancelled order
    deleteOrder: async (id) => {
        const response = await api.delete(`/orders/${id}`);
        return response.data;
    }
};