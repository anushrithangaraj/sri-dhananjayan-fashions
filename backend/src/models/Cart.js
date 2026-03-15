// backend/src/models/Cart.js
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    images: [{
        type: String
    }],
    categories: [{
        type: String
    }],
    stock: {
        type: Number,
        default: 0
    },
    stockByColor: [{
        color: String,
        stock: Number
    }],
    sizes: [{
        type: String
    }],
    colors: [{
        type: String
    }],
    discount: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    selectedSize: {
        type: String,
        default: null
    },
    selectedColor: {
        type: String,
        default: null
    }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    totalItems: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    gstAmount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = this.items.reduce((total, item) => total + (item.discountedPrice * item.quantity), 0);
    this.gstAmount = subtotal * 0.18; // 18% GST
    this.totalPrice = subtotal + this.gstAmount;
    next();
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;