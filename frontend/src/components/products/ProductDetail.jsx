// frontend/src/components/products/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineHeart, HiOutlineZoomIn } from 'react-icons/hi';
import Rating from '../components/common/Rating';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import Loader from '../common/Loader';
import { motion } from 'framer-motion';

const ProductDetail = () => {
    const { id } = useParams();
    const { getProductById } = useProducts();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        setLoading(false);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        if (!selectedColor) {
            alert('Please select a color');
            return;
        }
        addToCart(product, quantity, selectedSize, selectedColor);
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!product) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
            </div>
        );
    }

    const discountedPrice = product.price * (1 - product.discount / 100);

    return (
        <div className="container-custom py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div 
                        className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in"
                        onMouseEnter={() => setIsZoomed(true)}
                        onMouseLeave={() => setIsZoomed(false)}
                    >
                        <img
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className={`w-full h-full object-cover transition-transform duration-300 ${
                                isZoomed ? 'scale-150' : 'scale-100'
                            }`}
                            style={{
                                transformOrigin: `${isZoomed ? '50% 50%' : 'center'}`
                            }}
                        />
                        <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-soft">
                            <HiOutlineZoomIn className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {product.images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                                    selectedImage === index 
                                        ? 'border-primary-600' 
                                        : 'border-transparent hover:border-primary-300'
                                }`}
                            >
                                <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    {/* Title and Rating */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                        <div className="flex items-center">
                            <Rating
                                count={5}
                                value={product.rating}
                                size={24}
                                activeColor="#ffd700"
                                edit={false}
                            />
                            <span className="ml-2 text-gray-600">
                                ({product.numReviews} reviews)
                            </span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-4">
                        {product.discount > 0 ? (
                            <>
                                <span className="text-3xl font-bold text-primary-600">
                                    ₹{discountedPrice.toFixed(0)}
                                </span>
                                <span className="text-xl text-gray-400 line-through">
                                    ₹{product.price}
                                </span>
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {product.discount}% OFF
                                </span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold text-primary-600">
                                ₹{product.price}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">Select Size</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 border rounded-lg transition ${
                                            selectedSize === size
                                                ? 'bg-primary-600 text-white border-primary-600'
                                                : 'border-gray-300 text-gray-700 hover:border-primary-600'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Color Selection */}
                    {product.colors && product.colors.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">Select Color</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 border rounded-lg transition ${
                                            selectedColor === color
                                                ? 'bg-primary-600 text-white border-primary-600'
                                                : 'border-gray-300 text-gray-700 hover:border-primary-600'
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stock Status */}
                    <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                            product.stock > 10 ? 'bg-green-500' : 
                            product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="text-gray-600">
                            {product.stock > 10 ? 'In Stock' : 
                             product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                        </span>
                    </div>

                    {/* Quantity */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Quantity</h3>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                -
                            </button>
                            <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                disabled={quantity >= 10 || quantity >= product.stock}
                                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            <HiOutlineShoppingBag className="w-5 h-5" />
                            <span>Add to Cart</span>
                        </button>
                        <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                            <HiOutlineHeart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;