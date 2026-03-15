// backend/src/models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        price: Number,
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        size: String,
        color: String,
        image: String
    }],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'COD'
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    gstAmount: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    orderId: {
        type: String,
        unique: true
    },
    deletedByUser: {
        type: Boolean,
        default: false
    },
    deletedByAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Generate unique order ID before saving
orderSchema.pre('save', async function(next) {
    if (!this.orderId) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderId = `DF${year}${month}${day}${random}`;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;