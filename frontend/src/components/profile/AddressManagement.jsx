// frontend/src/components/profile/AddressManagement.jsx
import React, { useState, useEffect } from 'react';
import { addressService } from '../../services/addressService';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineHome, HiOutlineBriefcase, HiOutlineLocationMarker } from 'react-icons/hi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AddressManagement = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: '',
        label: 'Home',
        isDefault: false
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const data = await addressService.getUserAddresses();
            setAddresses(data);
        } catch (error) {
            toast.error('Failed to load addresses');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingAddress) {
                await addressService.updateAddress(editingAddress._id, formData);
                toast.success('Address updated successfully');
            } else {
                await addressService.createAddress(formData);
                toast.success('Address added successfully');
            }

            fetchAddresses();
            resetForm();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save address');
        }
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setFormData({
            fullName: address.fullName,
            address: address.address,
            city: address.city,
            postalCode: address.postalCode,
            country: address.country,
            phone: address.phone,
            label: address.label,
            isDefault: address.isDefault
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;

        try {
            await addressService.deleteAddress(id);
            toast.success('Address deleted successfully');
            fetchAddresses();
        } catch (error) {
            toast.error('Failed to delete address');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await addressService.setDefaultAddress(id);
            toast.success('Default address updated');
            fetchAddresses();
        } catch (error) {
            toast.error('Failed to set default address');
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            address: '',
            city: '',
            postalCode: '',
            country: '',
            phone: '',
            label: 'Home',
            isDefault: false
        });
        setEditingAddress(null);
        setShowForm(false);
    };

    const getLabelIcon = (label) => {
        switch (label) {
            case 'Home':
                return <HiOutlineHome className="w-5 h-5" />;
            case 'Work':
                return <HiOutlineBriefcase className="w-5 h-5" />;
            default:
                return <HiOutlineLocationMarker className="w-5 h-5" />;
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading addresses...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">My Addresses</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition"
                >
                    <HiOutlinePlus className="w-5 h-5" />
                    Add Address
                </button>
            </div>

            {/* Address Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 p-6 rounded-lg"
                >
                    <h3 className="text-lg font-semibold mb-4">
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address *
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Postal Code *
                                </label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Label
                                </label>
                                <select
                                    name="label"
                                    value={formData.label}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                >
                                    <option value="Home">Home</option>
                                    <option value="Work">Work</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                                    Set as default address
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition"
                            >
                                {editingAddress ? 'Update' : 'Add'} Address
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Address List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                    <motion.div
                        key={address._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`border rounded-lg p-4 ${address.isDefault ? 'border-rose-500 bg-rose-50' : 'border-gray-200'}`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {getLabelIcon(address.label)}
                                <span className="font-medium text-gray-800">{address.label}</span>
                                {address.isDefault && (
                                    <span className="bg-rose-100 text-rose-800 text-xs px-2 py-1 rounded">
                                        Default
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleEdit(address)}
                                    className="text-gray-500 hover:text-rose-600 p-1"
                                >
                                    <HiOutlinePencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(address._id)}
                                    className="text-gray-500 hover:text-red-600 p-1"
                                >
                                    <HiOutlineTrash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-gray-800">{address.fullName}</p>
                            <p>{address.address}</p>
                            <p>{address.city}, {address.postalCode}</p>
                            <p>{address.country}</p>
                            <p>{address.phone}</p>
                        </div>

                        {!address.isDefault && (
                            <button
                                onClick={() => handleSetDefault(address._id)}
                                className="mt-3 text-sm text-rose-600 hover:text-rose-800 font-medium"
                            >
                                Set as default
                            </button>
                        )}
                    </motion.div>
                ))}
            </div>

            {addresses.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                    No addresses saved yet. Add your first address above.
                </div>
            )}
        </div>
    );
};

export default AddressManagement;