// frontend/src/pages/OrderSuccessPage.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { HiOutlineCheckCircle, HiOutlineShoppingBag } from 'react-icons/hi';
import { motion } from 'framer-motion';

const OrderSuccessPage = () => {
    const { orderId } = useParams();

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-12">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center border border-amber-100"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HiOutlineCheckCircle className="w-12 h-12 text-green-500" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Order Placed Successfully!
                    </h1>

                    <p className="text-gray-600 mb-2">
                        Thank you for shopping with Dhananjayan Fashions.
                    </p>
                    
                    <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-lg p-4 mb-6 border border-amber-200">
                        <p className="text-sm text-gray-600">Your Order ID</p>
                        <p className="text-2xl font-mono font-bold text-rose-600">
                            {orderId}
                        </p>
                    </div>

                    <p className="text-gray-600 mb-8">
                        We have sent the order details to your email. 
                        You will receive a confirmation call shortly.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/products"
                            className="bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition inline-flex items-center justify-center shadow-lg"
                        >
                            <HiOutlineShoppingBag className="w-5 h-5 mr-2" />
                            Continue Shopping
                        </Link>
                        <Link
                            to="/orders"
                            className="border-2 border-rose-600 text-rose-600 px-6 py-3 rounded-lg font-semibold hover:bg-rose-50 transition inline-flex items-center justify-center"
                        >
                            View Orders
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;