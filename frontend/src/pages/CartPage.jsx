// frontend/src/pages/CartPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { HiOutlineShoppingBag, HiOutlineLogin } from 'react-icons/hi';

const CartPage = () => {
    const { cartItems, loading } = useCart();
    const { isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-12">
                <div className="container-custom">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading your cart...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-12">
                <div className="container-custom">
                    <div className="text-center py-12">
                        <HiOutlineLogin className="w-24 h-24 mx-auto text-rose-300" />
                        <h2 className="text-2xl font-bold text-gray-800 mt-4">Please Login</h2>
                        <p className="text-gray-600 mt-2">You need to be logged in to view your cart.</p>
                        <div className="mt-6 space-x-4">
                            <Link
                                to="/login"
                                className="inline-block bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="inline-block bg-gray-100 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-12">
                <div className="container-custom">
                    <div className="text-center py-12">
                        <HiOutlineShoppingBag className="w-24 h-24 mx-auto text-rose-300" />
                        <h2 className="text-2xl font-bold text-gray-800 mt-4">Your cart is empty</h2>
                        <p className="text-gray-600 mt-2">Looks like you haven't added anything to your cart yet.</p>
                        <Link
                            to="/products"
                            className="inline-block mt-6 bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-8">
            <div className="container-custom">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart ({cartItems.length} items)</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-amber-100">
                            {cartItems.map((item, index) => (
                                <CartItem key={`${item._id}-${item.selectedSize}-${item.selectedColor}-${index}`} item={item} />
                            ))}
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div>
                        <CartSummary />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;