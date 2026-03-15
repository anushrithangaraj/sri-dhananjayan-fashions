// frontend/src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ProductGrid from '../components/products/ProductGrid';
import Loader from '../components/common/Loader';
import StarRating from '../components/common/StarRating';
import ModelViewer from '../components/products/ModelViewer';
import { motion } from 'framer-motion';
import { 
    HiOutlineShoppingBag, 
    HiOutlineHeart, 
    HiOutlineZoomIn,
    HiOutlineTruck,
    HiOutlineShieldCheck,
    HiOutlineRefresh,
    HiOutlineChevronLeft,
    HiOutlineChevronRight
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProductById, products, fetchProducts } = useProducts();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [showModelViewer, setShowModelViewer] = useState(false);

    useEffect(() => {
        loadProduct();
    }, [id]);

    useEffect(() => {
        if (product) {
            loadRelatedProducts();
        }
    }, [product]);

    const loadProduct = async () => {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        setSelectedImage(0);
        setSelectedSize('');
        setSelectedColor('');
        setQuantity(1);
        setLoading(false);
    };

    const loadRelatedProducts = async () => {
        if (product?.categories && product.categories.length > 0) {
            // use first category to find related items
            const cat = product.categories[0];
            await fetchProducts(1, { category: cat, limit: 4 });
            const related = products.filter(p => p._id !== product._id).slice(0, 4);
            setRelatedProducts(related);
        }
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x, y });
    };

    const handleAddToCart = () => {
        // only require size/color when the product actually has them
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            toast.error('Please select a size');
            return;
        }
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            toast.error('Please select a color');
            return;
        }
        addToCart(product, quantity, selectedSize, selectedColor);
        // after adding the item take the user to cart
        navigate('/cart');
    };

    const handleBuyNow = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            toast.error('Please select a size');
            return;
        }
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            toast.error('Please select a color');
            return;
        }
        addToCart(product, quantity, selectedSize, selectedColor);
        // take the user straight to checkout when they buy now
        navigate('/checkout');
    };

    const handleARView = () => {
        if (product.modelUrl) {
            setShowModelViewer(true);
        } else {
            toast.error('3D model not available for this product');
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-12">
                <div className="container-custom text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
                    <Link to="/products" className="inline-block bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 transition">
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const discountedPrice = product.price * (1 - product.discount / 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-8">
            <div className="container-custom">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                    <Link to="/" className="hover:text-rose-600 transition">Home</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-rose-600 transition">Products</Link>
                    <span>/</span>
                    <Link to={`/products?category=${product.categories?.[0] || ''}`} className="hover:text-rose-600 transition">
                        {product.categories?.join(', ')}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-400">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div 
                            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in group"
                            onMouseEnter={() => setIsZoomed(true)}
                            onMouseLeave={() => setIsZoomed(false)}
                            onMouseMove={handleMouseMove}
                        >
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className={`w-full h-full object-cover transition-transform duration-300 ${
                                    isZoomed ? 'scale-150' : 'scale-100'
                                }`}
                                style={{
                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                }}
                            />
                            
                            {/* Zoom Indicator */}
                            <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-soft opacity-0 group-hover:opacity-100 transition">
                                <HiOutlineZoomIn className="w-5 h-5 text-gray-700" />
                            </div>

                            {/* Discount Badge */}
                            {product.discount > 0 && (
                                <div className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {product.discount}% OFF
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                                        selectedImage === index 
                                            ? 'border-rose-500' 
                                            : 'border-transparent hover:border-rose-300'
                                    }`}
                                >
                                    <img 
                                        src={img} 
                                        alt={`${product.name} ${index + 1}`} 
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* AR View Button - Optional Feature */}
                        <button
                            onClick={handleARView}
                            className="w-full py-3 border-2 border-rose-600 text-rose-600 rounded-lg font-medium hover:bg-rose-50 transition flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>View 3D Model</span>
                        </button>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Title and Rating */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                            <div className="flex items-center">
                                <StarRating
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
                                    <span className="text-3xl font-bold text-rose-600">
                                        ₹{discountedPrice.toFixed(0)}
                                    </span>
                                    <span className="text-xl text-gray-400 line-through">
                                        ₹{product.price}
                                    </span>
                                    <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        Save ₹{(product.price - discountedPrice).toFixed(0)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-3xl font-bold text-rose-600">
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
                                                    ? 'bg-rose-600 text-white border-rose-600'
                                                    : 'border-gray-300 text-gray-700 hover:border-rose-500 hover:text-rose-600'
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
                                                    ? 'bg-rose-600 text-white border-rose-600'
                                                    : 'border-gray-300 text-gray-700 hover:border-rose-500 hover:text-rose-600'
                                            }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stock Status */}
                        {(() => {
                            const currentStock = selectedColor && product.stockByColor
                                ? (product.stockByColor.find(s => s.color === selectedColor)?.stock ?? 0)
                                : product.stock;
                            return (
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${
                                        currentStock > 10 ? 'bg-green-500' : 
                                        currentStock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`} />
                                    <span className="text-gray-600">
                                        {currentStock > 10 ? 'In Stock' : 
                                         currentStock > 0 ? `Only ${currentStock} left` : 'Out of Stock'}
                                    </span>
                                </div>
                            );
                        })()}

                        {/* Quantity */}
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">Quantity</h3>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 transition"
                                >
                                    -
                                </button>
                                <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                    disabled={quantity >= 10 || quantity >=
                                        (selectedColor && product.stockByColor
                                            ? (product.stockByColor.find(s => s.color === selectedColor)?.stock ?? 0)
                                            : product.stock
                                        )}
                                    className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 transition"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={
                                    (selectedColor && product.stockByColor
                                        ? (product.stockByColor.find(s => s.color === selectedColor)?.stock ?? 0)
                                        : product.stock) === 0
                                }
                                className="flex-1 bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg"
                            >
                                <HiOutlineShoppingBag className="w-5 h-5" />
                                <span>Add to Cart</span>
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={
                                    (selectedColor && product.stockByColor
                                        ? (product.stockByColor.find(s => s.color === selectedColor)?.stock ?? 0)
                                        : product.stock) === 0
                                }
                                className="flex-1 bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition disabled:opacity-50"
                            >
                                Buy Now
                            </button>
                            <button className="p-3 border border-gray-300 rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-500 transition">
                                <HiOutlineHeart className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-200">
                            <div className="text-center">
                                <HiOutlineTruck className="w-6 h-6 mx-auto text-rose-600 mb-2" />
                                <p className="text-xs text-gray-600">Free Shipping</p>
                            </div>
                            <div className="text-center">
                                <HiOutlineShieldCheck className="w-6 h-6 mx-auto text-rose-600 mb-2" />
                                <p className="text-xs text-gray-600">Secure Payment</p>
                            </div>
                            <div className="text-center">
                                <HiOutlineRefresh className="w-6 h-6 mx-auto text-rose-600 mb-2" />
                                <p className="text-xs text-gray-600">15 Days Return</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold mb-8 text-gray-800">You May Also Like</h2>
                        <ProductGrid products={relatedProducts} />
                    </section>
                )}

                {/* Product Details Tabs */}
                <section className="mt-16">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-amber-100">
                        <div className="border-b border-amber-200">
                            <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                <button className="py-4 px-1 border-b-2 border-rose-600 text-rose-600 font-medium">
                                    Description
                                </button>
                                <button className="py-4 px-1 text-gray-500 hover:text-rose-600 font-medium">
                                    Specifications
                                </button>
                                <button className="py-4 px-1 text-gray-500 hover:text-rose-600 font-medium">
                                    Reviews ({product.numReviews})
                                </button>
                            </nav>
                        </div>
                        <div className="p-6">
                            <div className="prose max-w-none">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Product Details</h3>
                                <p className="text-gray-600 mb-4">{product.description}</p>
                                
                                <h4 className="font-semibold mb-2 text-gray-800">Key Features:</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Premium quality fabric</li>
                                    <li>Comfortable fit</li>
                                    <li>Easy care instructions</li>
                                    <li>Made in India</li>
                                </ul>

                                <h4 className="font-semibold mt-4 mb-2 text-gray-800">Care Instructions:</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Dry clean only</li>
                                    <li>Do not bleach</li>
                                    <li>Iron on medium heat</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* 3D Model Viewer Modal */}
            {showModelViewer && product.modelUrl && (
                <ModelViewer
                    modelUrl={product.modelUrl}
                    productName={product.name}
                    onClose={() => setShowModelViewer(false)}
                />
            )}
        </div>
    );
};

export default ProductDetailPage;