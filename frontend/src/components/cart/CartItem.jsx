// frontend/src/components/cart/CartItem.jsx
import React from 'react';
import { HiOutlineTrash, HiOutlineMinus, HiOutlinePlus } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();

    const handleQuantityChange = (newQuantity) => {
        let availableStock = item.stock;
        if (item.selectedColor && item.stockByColor) {
            const entry = item.stockByColor.find(s => s.color === item.selectedColor);
            if (entry) availableStock = entry.stock;
        }
        if (newQuantity >= 1 && newQuantity <= 10 && newQuantity <= availableStock) {
            updateQuantity(item.product?._id || item._id, item.selectedSize, item.selectedColor, newQuantity);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-gray-200 last:border-0">
            {/* Product Image */}
            <div className="w-24 h-24 flex-shrink-0">
                <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>

            {/* Product Details */}
            <div className="flex-1 ml-0 sm:ml-4 mt-4 sm:mt-0">
                <Link to={item.product?._id ? `/product/${item.product._id}` : '#'} className="hover:text-primary-600">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                </Link>
                
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    {item.selectedSize && (
                        <span>Size: <span className="font-medium">{item.selectedSize}</span></span>
                    )}
                    {item.selectedColor && (
                        <span>Color: <span className="font-medium">{item.selectedColor}</span></span>
                    )}
                </div>

                {/* Price */}
                <div className="mt-2">
                    <span className="text-lg font-bold text-primary-600">
                        ₹{item.discount > 0 
                            ? (item.price * (1 - item.discount/100)).toFixed(0) 
                            : item.price
                        }
                    </span>
                    {item.discount > 0 && (
                        <span className="ml-2 text-sm text-gray-400 line-through">
                            ₹{item.price}
                        </span>
                    )}
                </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0">
                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <HiOutlineMinus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                        disabled={(() => {
                            let availableStock = item.stock;
                            if (item.selectedColor && item.stockByColor) {
                                const entry = item.stockByColor.find(s => s.color === item.selectedColor);
                                if (entry) availableStock = entry.stock;
                            }
                            return item.quantity >= 10 || item.quantity >= availableStock;
                        })()}
                        className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <HiOutlinePlus className="w-4 h-4" />
                    </button>
                </div>

                {/* Item Total */}
                <div className="ml-4 font-semibold text-gray-800">
                    ₹{(item.discount > 0 
                        ? (item.price * (1 - item.discount/100)) 
                        : item.price
                    ) * item.quantity}
                </div>

                {/* Remove Button */}
                <button
                    onClick={() => removeFromCart(item.product?._id || item._id, item.selectedSize, item.selectedColor)}
                    className="ml-4 p-2 text-gray-400 hover:text-red-500 transition"
                >
                    <HiOutlineTrash className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default CartItem;