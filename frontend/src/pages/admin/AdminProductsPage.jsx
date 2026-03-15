// frontend/src/pages/admin/AdminProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import Loader from '../../components/common/Loader';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await productService.getProducts({ limit: 100 });
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error loading products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await productService.deleteProduct(id);
            toast.success('Product deleted successfully');
            loadProducts();
            setDeleteConfirm(null);
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-8">
            <div className="container-custom">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Product Management</h1>

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">Total Products: {products.length}</p>
                    <Link
                        to="/admin/products/add"
                        className="bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition flex items-center shadow-lg"
                    >
                        <HiOutlinePlus className="w-5 h-5 mr-2" />
                        Add New Product
                    </Link>
                </div>

                {/* Products Table */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-amber-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-rose-50 to-amber-50 border-b border-amber-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-200">
                                {products.map((product) => (
                                    <motion.tr
                                        key={product._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-rose-50/50 transition"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <img
                                                    src={product.images?.[0] || 'https://via.placeholder.com/50'}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded-lg border border-amber-200"
                                                />
                                                <div className="ml-4">
                                                    <p className="font-medium text-gray-800">{product.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-sm font-medium">
                                                {product.categories?.join(', ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-rose-600">₹{product.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`font-medium ${
                                                product.stock > 10 ? 'text-green-600' :
                                                product.stock > 0 ? 'text-amber-600' : 'text-red-600'
                                            }`}>
                                                {product.stock}
                                            </span>
                                            {product.stockByColor && product.stockByColor.length > 0 && (
                                                <div className="text-xs text-gray-500">
                                                    {product.stockByColor.map(s => `${s.color}:${s.stock}`).join(', ')}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <Link
                                                    to={`/admin/products/edit/${product._id}`}
                                                    className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition"
                                                >
                                                    <HiOutlinePencil className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteConfirm(product._id)}
                                                    className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                                                >
                                                    <HiOutlineTrash className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {/* Delete Confirmation Modal */}
                                            {deleteConfirm === product._id && (
                                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 max-w-sm border border-amber-100 shadow-xl">
                                                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h3>
                                                        <p className="text-gray-600 mb-6">
                                                            Are you sure you want to delete "{product.name}"?
                                                        </p>
                                                        <div className="flex justify-end space-x-3">
                                                            <button
                                                                onClick={() => setDeleteConfirm(null)}
                                                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(product._id)}
                                                                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition shadow-md"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductsPage;