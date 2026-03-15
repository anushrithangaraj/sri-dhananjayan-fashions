// frontend/src/context/ProductContext.jsx
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    totalCount: 0
  });
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    color: '',
    sort: 'newest',
    search: ''
  });

  const fetchProducts = async (page = 1, filterParams = filters) => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams({
        page,
        ...filterParams
      });

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products?${params}`
      );
      
      setProducts(response.data.products);
      setPagination({
        page: response.data.page,
        pages: response.data.pages,
        totalCount: response.data.totalCount
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/featured`
      );
      setFeaturedProducts(response.data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const getProductById = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      return null;
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      size: '',
      color: '',
      sort: 'newest',
      search: ''
    });
  };

  const value = {
    products,
    featuredProducts,
    loading,
    pagination,
    filters,
    fetchProducts,
    fetchFeaturedProducts,
    getProductById,
    updateFilters,
    resetFilters
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};