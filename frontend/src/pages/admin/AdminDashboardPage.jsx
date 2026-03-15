// frontend/src/pages/admin/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { 
    HiOutlineShoppingBag, 
    HiOutlineCube,
    HiOutlineUser,
    HiOutlineCurrencyRupee,
    HiOutlineExclamation
} from 'react-icons/hi';
import { motion } from 'framer-motion';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/admin/dashboard');
            setStats(response.data.stats);
            setRecentOrders(response.data.recentOrders || []);
            setLowStockProducts(response.data.lowStockProducts || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Products',
            value: stats?.totalProducts || 0,
            icon: HiOutlineCube,
            color: 'bg-rose-500',
            link: '/admin/products'
        },
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: HiOutlineShoppingBag,
            color: 'bg-amber-600',
            link: '/admin/orders'
        },
        {
            title: 'Total Customers',
            value: stats?.totalUsers || 0,
            icon: HiOutlineUser,
            color: 'bg-rose-600',
            link: '/admin/orders'
        },
        {
            title: 'Total Revenue',
            value: `₹${stats?.totalRevenue?.toFixed(0) || 0}`,
            icon: HiOutlineCurrencyRupee,
            color: 'bg-amber-500',
            link: '/admin/orders'
        }
    ];

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-8">
            <div className="container-custom">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                to={stat.link}
                                className="block bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition border border-amber-100"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">{stat.title}</p>
                                        <p className="text-2xl font-bold mt-2 text-gray-800">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.color} p-3 rounded-lg shadow-md`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Orders */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-amber-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
                            <Link to="/admin/orders" className="text-rose-600 hover:text-rose-700 text-sm font-medium transition">
                                View All →
                            </Link>
                        </div>
                        
                        {recentOrders.length > 0 ? (
                            <div className="space-y-4">
                                {recentOrders.slice(0, 5).map((order) => (
                                    <div key={order._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-amber-50 rounded-lg border border-amber-100">
                                        <div>
                                            <p className="font-mono text-sm font-semibold text-gray-800">{order.orderId}</p>
                                            <p className="text-sm text-gray-600">
                                                {order.user?.name} • ₹{order.totalPrice}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No orders yet</p>
                        )}
                    </div>

                    {/* Low Stock Alert */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-amber-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <HiOutlineExclamation className="w-5 h-5 text-rose-500 mr-2" />
                                Low Stock Alert
                            </h2>
                            <Link to="/admin/products" className="text-rose-600 hover:text-rose-700 text-sm font-medium transition">
                                Manage Products →
                            </Link>
                        </div>
                        
                        {lowStockProducts.length > 0 ? (
                            <div className="space-y-4">
                                {lowStockProducts.map((product) => (
                                    <div key={product._id} className="flex items-center justify-between p-4 bg-rose-50 rounded-lg border border-rose-200">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={product.images?.[0] || 'https://via.placeholder.com/40'}
                                                alt={product.name}
                                                className="w-10 h-10 object-cover rounded-lg border border-amber-200"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800">{product.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    Stock: <span className="font-semibold text-rose-600">{product.stock}</span>
                                                    {product.stockByColor && product.stockByColor.length > 0 && (
                                                        <span> (by color: {product.stockByColor.map(s => `${s.color}:${s.stock}`).join(', ')})</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/admin/products/edit/${product._id}`}
                                            className="text-rose-600 hover:text-rose-700 text-sm font-medium transition"
                                        >
                                            Update Stock
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-green-600 font-medium mb-2">✓ All products are well stocked</p>
                                <p className="text-sm text-gray-500">No low stock alerts</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;