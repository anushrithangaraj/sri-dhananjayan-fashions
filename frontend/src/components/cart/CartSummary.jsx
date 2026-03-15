// frontend/src/components/cart/CartSummary.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSummary = () => {
    const { cartItems, cartTotal, gstAmount } = useCart();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((total, item) => {
        const price = item.discount > 0 
            ? item.price * (1 - item.discount/100) 
            : item.price;
        return total + (price * item.quantity);
    }, 0);

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span>₹{gstAmount.toFixed(0)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary-600">₹{cartTotal.toFixed(0)}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Proceed to Checkout
            </button>

            {cartItems.length === 0 && (
                <p className="text-sm text-gray-500 text-center mt-3">
                    Your cart is empty
                </p>
            )}
        </div>
    );
};

export default CartSummary;