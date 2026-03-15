// frontend/src/pages/OrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import Loader from '../components/common/Loader';
import { HiOutlineShoppingBag, HiOutlineClock, HiOutlineTruck, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineTrash } from 'react-icons/hi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await orderService.getUserOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered':
                return <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />;
            case 'Shipped':
                return <HiOutlineTruck className="w-5 h-5 text-blue-500" />;
            case 'Processing':
                return <HiOutlineClock className="w-5 h-5 text-yellow-500" />;
            case 'Cancelled':
                return <HiOutlineXCircle className="w-5 h-5 text-red-500" />;
            default:
                return <HiOutlineClock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Shipped':
                return 'bg-blue-100 text-blue-800';
            case 'Processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            await orderService.cancelOrder(orderId);
            toast.success('Order cancelled successfully');
            loadOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const canCancelOrder = (status) => {
        return status === 'Pending' || status === 'Processing';
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this cancelled order? This action cannot be undone.')) {
            return;
        }

        try {
            await orderService.deleteOrder(orderId);
            toast.success('Order deleted successfully');
            loadOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete order');
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-12">
                <div className="container-custom">
                    <div className="text-center py-12">
                        <HiOutlineShoppingBag className="w-24 h-24 mx-auto text-rose-300" />
                        <h2 className="text-2xl font-bold text-gray-800 mt-4">No orders yet</h2>
                        <p className="text-gray-600 mt-2">Looks like you haven't placed any orders.</p>
                        <Link
                            to="/products"
                            className="inline-block mt-6 bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 transition"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-8">
            <div className="container-custom">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h1>

                <div className="space-y-6">
                    {orders.map((order) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-amber-100"
                        >
                            {/* Order Header */}
                            <div className="bg-gradient-to-r from-rose-50 to-amber-50 px-6 py-4 border-b border-amber-200">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Order ID</p>
                                        <p className="font-mono font-semibold text-gray-800">{order.orderId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Placed on</p>
                                        <p className="font-medium text-gray-800">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="font-bold text-rose-600">₹{order.totalPrice}</p>
                                    </div>
                                    <div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            <span className="ml-1">{order.status}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-4">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-lg border border-amber-200"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-800">{item.name}</h3>
                                                <p className="text-sm text-gray-600">
                                                    Quantity: {item.quantity} | Size: {item.size} | Color: {item.color}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-rose-600">₹{item.price * item.quantity}</p>
                                                <p className="text-sm text-gray-600">₹{item.price} each</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Actions */}
                                <div className="mt-4 pt-4 border-t border-amber-200 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex space-x-4">
                                        <Link
                                            to={`/product/${order.items[0].product}`}
                                            className="text-rose-600 hover:text-rose-700 font-medium transition"
                                        >
                                            Buy Again
                                        </Link>
                                        <Link
                                            to={`/orders/${order._id}`}
                                            className="text-gray-600 hover:text-rose-600 font-medium transition"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                    <div className="flex space-x-2">
                                        {canCancelOrder(order.status) && (
                                            <button
                                                onClick={() => handleCancelOrder(order._id)}
                                                className="flex items-center text-red-600 hover:text-red-700 font-medium transition"
                                            >
                                                <HiOutlineTrash className="w-4 h-4 mr-1" />
                                                Cancel Order
                                            </button>
                                        )}
                                        {order.status === 'Cancelled' && (
                                            <button
                                                onClick={() => handleDeleteOrder(order._id)}
                                                className="flex items-center text-red-600 hover:text-red-700 font-medium transition px-3 py-1 bg-red-50 rounded-lg"
                                            >
                                                <HiOutlineTrash className="w-4 h-4 mr-1" />
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;