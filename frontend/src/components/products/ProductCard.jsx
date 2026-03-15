// frontend/src/components/products/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineEye } from 'react-icons/hi';
import Rating from '../common/Rating'; // Import custom Rating
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);
    const [imgError, setImgError] = useState(false);

    const discountedPrice = product.price * (1 - product.discount / 100);

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product, 1);
    };

    const handleImageError = () => {
        setImgError(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={`/product/${product._id}`}>
                {/* Image Container */}
                <div className="relative overflow-hidden aspect-[3/4]">
                    <img
                        src={imgError 
                            ? `https://via.placeholder.com/300x400?text=${encodeURIComponent(product.name)}` 
                            : (product.images?.[0] || `https://via.placeholder.com/300x400?text=No+Image`)}
                        alt={product.name}
                        onError={handleImageError}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                            isHovered ? 'scale-110' : 'scale-100'
                        }`}
                    />
                    
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {product.discount}% OFF
                        </div>
                    )}

                    {/* Quick View Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowQuickView(!showQuickView);
                        }}
                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-soft hover:bg-primary-600 hover:text-white transition"
                    >
                        <HiOutlineEye className="w-5 h-5" />
                    </button>

                    {/* Hover Overlay - Add to Cart */}
                    <div
                        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-transform duration-300 ${
                            isHovered ? 'translate-y-0' : 'translate-y-full'
                        }`}
                    >
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-white text-gray-900 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-primary-600 hover:text-white transition"
                        >
                            <HiOutlineShoppingBag className="w-5 h-5" />
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                        {product.name}
                    </h3>
                    
                    <div className="flex items-center mb-2">
                        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                        <span className="text-sm text-gray-500 ml-2">
                            ({product.numReviews || 0})
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        {product.discount > 0 ? (
                            <>
                                <span className="text-xl font-bold text-primary-600">
                                    ₹{discountedPrice.toFixed(0)}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                    ₹{product.price}
                                </span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-primary-600">
                                ₹{product.price}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;