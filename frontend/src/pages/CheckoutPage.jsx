// frontend/src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { addressService } from '../services/addressService';
import { HiOutlineLocationMarker, HiOutlineUser, HiOutlinePhone, HiOutlinePlus, HiOutlineHome, HiOutlineBriefcase } from 'react-icons/hi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, gstAmount, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [address, setAddress] = useState({
        fullName: user?.name || '',
        address: '',
        city: '',
        postalCode: '',
        country: 'India',
        phone: '',
        label: 'Home',
        isDefault: false
    });

    // Redirect to cart if no items or user not authenticated
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
        if (user) {
            fetchAddresses();
        }
    }, [cartItems.length, navigate, user]);

    const fetchAddresses = async () => {
        try {
            setLoadingAddresses(true);
            console.log('Fetching addresses for user:', user);
            const userAddresses = await addressService.getUserAddresses();
            console.log('Fetched addresses:', userAddresses);
            setAddresses(userAddresses);

            // Auto-select default address if available
            const defaultAddress = userAddresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress._id);
            }
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
            console.error('Error details:', error.response?.data);
        } finally {
            setLoadingAddresses(false);
        }
    };

    const handleAddressSelect = (addressId) => {
        setSelectedAddressId(addressId);
        setShowNewAddressForm(false);
    };

    const handleNewAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            const newAddress = await addressService.createAddress(address);
            setAddresses(prev => [...prev, newAddress]);
            setSelectedAddressId(newAddress._id);
            setShowNewAddressForm(false);
            toast.success('Address added successfully');
            resetAddressForm();
        } catch (error) {
            toast.error('Failed to add address');
        }
    };

    const resetAddressForm = () => {
        setAddress({
            fullName: user?.name || '',
            address: '',
            city: '',
            postalCode: '',
            country: 'India',
            phone: '',
            label: 'Home',
            isDefault: false
        });
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

    const handleInputChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedAddressId && !showNewAddressForm) {
            toast.error('Please select a shipping address');
            return;
        }

        if (showNewAddressForm && (!address.fullName || !address.address || !address.city || !address.postalCode || !address.phone)) {
            toast.error('Please fill in all address fields');
            return;
        }

        setLoading(true);

        try {
            let orderData = {
                items: cartItems.map(item => ({
                    product: item.product,
                    name: item.name,
                    price: item.discount > 0
                        ? item.price * (1 - item.discount/100)
                        : item.price,
                    quantity: item.quantity,
                    size: item.selectedSize,
                    color: item.selectedColor,
                    image: item.images[0]
                })),
                paymentMethod: 'COD',
                itemsPrice: cartTotal - gstAmount,
                gstAmount: gstAmount,
                totalPrice: cartTotal
            };

            if (selectedAddressId) {
                // Use saved address
                orderData.addressId = selectedAddressId;
            } else {
                // Use new address
                orderData.shippingAddress = address;
            }

            const order = await orderService.createOrder(orderData);
            await clearCart();
            toast.success('Order placed successfully!');
            navigate(`/order-success/${order.orderId}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-8">
            <div className="container-custom">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipping Address */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-amber-100"
                        >
                            <h2 className="text-xl font-semibold mb-6 text-gray-800">Shipping Address</h2>

                            {/* Saved Addresses */}
                            {loadingAddresses ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
                                    <p className="text-gray-600 mt-2">Loading addresses...</p>
                                </div>
                            ) : addresses.length > 0 && !showNewAddressForm ? (
                                <div className="space-y-4 mb-6">
                                    <h3 className="text-lg font-medium text-gray-700">Select Address</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((addr) => (
                                            <div
                                                key={addr._id}
                                                onClick={() => handleAddressSelect(addr._id)}
                                                className={`border rounded-lg p-4 cursor-pointer transition ${
                                                    selectedAddressId === addr._id
                                                        ? 'border-rose-500 bg-rose-50'
                                                        : 'border-gray-200 hover:border-rose-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    {getLabelIcon(addr.label)}
                                                    <span className="font-medium text-gray-800">{addr.label}</span>
                                                    {addr.isDefault && (
                                                        <span className="bg-rose-100 text-rose-800 text-xs px-2 py-1 rounded">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <p className="font-medium">{addr.fullName}</p>
                                                    <p>{addr.address}</p>
                                                    <p>{addr.city}, {addr.postalCode}</p>
                                                    <p>{addr.country}</p>
                                                    <p>{addr.phone}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : !showNewAddressForm && !loadingAddresses && addresses.length === 0 ? (
                                <div className="text-center py-8">
                                    <HiOutlineLocationMarker className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">No saved addresses found</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowNewAddressForm(true);
                                            setSelectedAddressId('');
                                        }}
                                        className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition"
                                    >
                                        <HiOutlinePlus className="w-5 h-5" />
                                        Add Your First Address
                                    </button>
                                </div>
                            ) : null}

                            {/* Add New Address Button */}
                            {!showNewAddressForm && addresses.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowNewAddressForm(true);
                                        setSelectedAddressId('');
                                    }}
                                    className="flex items-center gap-2 text-rose-600 hover:text-rose-800 font-medium mb-6"
                                >
                                    <HiOutlinePlus className="w-5 h-5" />
                                    Add New Address
                                </button>
                            )}

                            {/* New Address Form */}
                            {showNewAddressForm && (
                                <motion.form
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    onSubmit={handleNewAddressSubmit}
                                    className="space-y-4 border-t border-amber-200 pt-6"
                                >
                                    <h3 className="text-lg font-medium text-gray-700">Add New Address</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <HiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={address.fullName}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <div className="relative">
                                            <HiOutlineLocationMarker className="absolute left-3 top-3 text-rose-400" />
                                            <textarea
                                                name="address"
                                                value={address.address}
                                                onChange={handleInputChange}
                                                rows="3"
                                                className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={address.city}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={address.postalCode}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <HiOutlinePhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={address.phone}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition"
                                        >
                                            Add Address
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowNewAddressForm(false);
                                                resetAddressForm();
                                            }}
                                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </motion.form>
                            )}

                            {/* Place Order Button */}
                            {(selectedAddressId || showNewAddressForm) && (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition disabled:opacity-50 mt-6 shadow-lg"
                                >
                                    {loading ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
                                </button>
                            )}
                        </motion.div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 sticky top-24 border border-amber-100">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
                            
                            <div className="space-y-3 mb-4">
                                {cartItems.map((item, index) => (
                                    <div key={`${item.product}-${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}-${index}`} className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            {item.name} x {item.quantity}
                                        </span>
                                        <span className="font-medium text-rose-600">
                                            ₹{(item.discount > 0 
                                                ? item.price * (1 - item.discount/100) 
                                                : item.price) * item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-amber-200 pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{(cartTotal - gstAmount).toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>GST (18%)</span>
                                    <span>₹{gstAmount.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg pt-2">
                                    <span>Total</span>
                                    <span className="text-rose-600">₹{cartTotal.toFixed(0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;