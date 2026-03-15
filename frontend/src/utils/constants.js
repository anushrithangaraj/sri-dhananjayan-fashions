// frontend/src/utils/constants.js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CATEGORIES = [
    { id: 'men', name: 'Men', icon: '👔' },
    { id: 'women', name: 'Women', icon: '👗' },
    { id: 'kids', name: 'Kids', icon: '🧸' }
];

export const SIZES = {
    men: ['S', 'M', 'L', 'XL', 'XXL'],
    women: ['XS', 'S', 'M', 'L', 'XL'],
    kids: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y']
};

export const COLORS = [
    'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 
    'Pink', 'Purple', 'Orange', 'Brown', 'Grey', 'Navy'
];

export const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' }
];

export const ORDER_STATUS = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
};

export const PAYMENT_METHODS = {
    cod: 'Cash on Delivery',
    card: 'Credit/Debit Card',
    upi: 'UPI'
};

export const GST_RATE = 18;

export const MAX_QUANTITY = 10;
export const MIN_QUANTITY = 1;