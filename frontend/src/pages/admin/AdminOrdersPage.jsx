// frontend/src/pages/admin/AdminOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import Loader from '../../components/common/Loader';
import { HiOutlineEye, HiOutlineXCircle } from 'react-icons/hi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await orderService.getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            toast.success('Order status updated');
            loadOrders();
            setSelectedOrder(null);
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this cancelled order? This action cannot be undone.')) {
            return;
        }

        try {
            await orderService.deleteOrder(orderId);
            toast.success('Order deleted successfully');
            loadOrders();
            setSelectedOrder(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete order');
        }
    };

    const filteredOrders = statusFilter === 'all' 
        ? orders 
        : orders.filter(order => order.status === statusFilter);

    const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const statusColors = {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Processing': 'bg-blue-100 text-blue-800',
        'Shipped': 'bg-purple-100 text-purple-800',
        'Delivered': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800'
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-8">
            <div className="container-custom">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Customer Orders</h1>

                {/* Status Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-4 py-2 rounded-lg transition ${
                            statusFilter === 'all'
                                ? 'bg-rose-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600'
                        }`}
                    >
                        All Orders ({orders.length})
                    </button>
                    {statusOptions.map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg transition ${
                                statusFilter === status
                                    ? 'bg-rose-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600'
                            }`}
                        >
                            {status} ({orders.filter(o => o.status === status).length})
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-amber-100"
                        >
                            <div className="bg-gradient-to-r from-rose-50 to-amber-50 px-6 py-4 border-b border-amber-200">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Order ID</p>
                                        <p className="font-mono font-semibold text-gray-800">{order.orderId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Customer</p>
                                        <p className="font-medium text-gray-800">{order.user?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Date</p>
                                        <p className="font-medium text-gray-800">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total</p>
                                        <p className="font-bold text-rose-600">₹{order.totalPrice}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                                            {order.status}
                                        </span>
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-2 text-gray-600 hover:bg-rose-200 hover:text-rose-600 rounded-lg transition"
                                        >
                                            <HiOutlineEye className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/90 backdrop-blur-sm rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-100"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-rose-50 to-amber-50 border-b border-amber-200 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 text-gray-600 hover:bg-rose-200 rounded-lg transition"
                                >
                                    <HiOutlineXCircle className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-6">
                                {/* Order Info */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Order ID</p>
                                            <p className="font-mono font-semibold text-gray-800">{selectedOrder.orderId}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Date</p>
                                            <p className="font-medium text-gray-800">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Customer</p>
                                            <p className="font-medium text-gray-800">{selectedOrder.user?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium text-rose-600">{selectedOrder.user?.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Shipping Address</h3>
                                    <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-4 rounded-lg border border-amber-200">
                                        <p className="font-medium text-gray-800">{selectedOrder.shippingAddress?.fullName}</p>
                                        <p className="text-gray-600">{selectedOrder.shippingAddress?.address}</p>
                                        <p className="text-gray-600">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                                        <p className="text-gray-600">{selectedOrder.shippingAddress?.country}</p>
                                        <p className="text-gray-600 mt-2">Phone: {selectedOrder.shippingAddress?.phone}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Items</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.items?.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-rose-50 to-amber-50 rounded-lg border border-amber-200">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800">{item.name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Qty: {item.quantity} | Size: {item.size} | Color: {item.color}
                                                    </p>
                                                </div>
                                                <p className="font-semibold text-rose-600">₹{(item.price * item.quantity).toFixed(0)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-4 rounded-lg border border-amber-200">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="font-medium text-gray-800">₹{selectedOrder.itemsPrice?.toFixed(0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">GST (18%):</span>
                                            <span className="font-medium text-gray-800">₹{selectedOrder.gstAmount?.toFixed(0)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold border-t border-amber-200 pt-2">
                                            <span className="text-gray-800">Total:</span>
                                            <span className="text-rose-600">₹{selectedOrder.totalPrice?.toFixed(0)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Update */}
                                {selectedOrder.status !== 'Cancelled' && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Update Status</h3>
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {selectedOrder.status === 'Cancelled' && (
                                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                        <p className="text-red-700 font-medium mb-4">This order has been cancelled and cannot be updated.</p>
                                        <button
                                            onClick={() => handleDeleteOrder(selectedOrder._id)}
                                            className="w-full px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium shadow-lg"
                                        >
                                            Delete This Order
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrdersPage;