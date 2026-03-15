// frontend/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import AddressManagement from '../components/profile/AddressManagement';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await authService.updateProfile({
                name: formData.name,
                email: formData.email,
                password: formData.newPassword || undefined
            });
            toast.success('Profile updated successfully');
            
            // Clear password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-8">
            <div className="container-custom max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-amber-100"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-rose-600 to-amber-700 px-6 py-8 text-white">
                        <h1 className="text-3xl font-bold">My Account</h1>
                        <p className="text-rose-100 mt-2">Manage your profile and addresses</p>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-amber-200">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                                    activeTab === 'profile'
                                        ? 'text-rose-600 border-b-2 border-rose-600'
                                        : 'text-gray-600 hover:text-rose-600'
                                }`}
                            >
                                <HiOutlineUser className="w-5 h-5" />
                                Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('addresses')}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                                    activeTab === 'addresses'
                                        ? 'text-rose-600 border-b-2 border-rose-600'
                                        : 'text-gray-600 hover:text-rose-600'
                                }`}
                            >
                                <HiOutlineLocationMarker className="w-5 h-5" />
                                Addresses
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'profile' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <HiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password Change Section */}
                                    <div className="border-t border-amber-200 pt-6">
                                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Change Password</h2>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400" />
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        value={formData.newPassword}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                                                        placeholder="Leave blank to keep current"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <div className="relative">
                                                    <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400" />
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                                                        placeholder="Confirm new password"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition disabled:opacity-50 shadow-lg"
                                        >
                                            {loading ? 'Updating...' : 'Update Profile'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={logout}
                                            className="px-6 py-3 border border-rose-300 text-rose-600 rounded-lg hover:bg-rose-50 transition"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === 'addresses' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <AddressManagement />
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;