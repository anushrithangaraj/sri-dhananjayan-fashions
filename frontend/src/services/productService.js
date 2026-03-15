// frontend/src/services/productService.js
import api from './api';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const productService = {
    // Get all products with filters
    getProducts: async (params = {}) => {
        const response = await api.get('/products', { params });
        return response.data;
    },

    // Get single product
    getProductById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    // Get featured products
    getFeaturedProducts: async () => {
        const response = await api.get('/products/featured');
        return response.data;
    },

    // Get products by category
    getProductsByCategory: async (category) => {
        const response = await api.get(`/products/category/${category}`);
        return response.data;
    },

    // Create product (admin)
    createProduct: async (productData) => {
        const response = await api.post('/products', productData);
        return response.data;
    },

    // Update product (admin)
    updateProduct: async (id, productData) => {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    },

    // Delete product (admin)
    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },

    // Upload product images (admin)
    uploadImages: async (id, formData) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/products/${id}/images`, formData, {
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            }
        });
        return response.data;
    },

    // Upload product 3D model (admin)
    uploadModel: async (id, formData) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/products/${id}/model`, formData, {
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            }
        });
        return response.data;
    }
};