// frontend/src/utils/helpers.js
// Format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Calculate discounted price
export const getDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
};

// Format date
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Truncate text
export const truncateText = (text, length = 100) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};

// Generate order ID
export const generateOrderId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `ORD-${timestamp}${random}`.toUpperCase();
};

// Validate email
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone);
};

// Group array by key
export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        (result[item[key]] = result[item[key]] || []).push(item);
        return result;
    }, {});
};

// Calculate average rating
export const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
};

// Get stock status
export const getStockStatus = (stock) => {
    if (stock > 10) return { text: 'In Stock', color: 'green' };
    if (stock > 0) return { text: `Only ${stock} left`, color: 'yellow' };
    return { text: 'Out of Stock', color: 'red' };
};

export const getImageUrl = (images, index = 0, productName = 'Product') => {
    if (images && images.length > 0 && images[index]) {
        return images[index];
    }
    return `https://via.placeholder.com/300x400?text=${encodeURIComponent(productName)}`;
};