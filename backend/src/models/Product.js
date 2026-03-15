// backend/src/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: 0
    },
    // new array field allowing products to belong to multiple categories
    categories: [{
        type: String,
        required: [true, 'At least one product category is required'],
        enum: ['Men', 'Women', 'Kids']
    }],
    // legacy single category kept for backward compatibility; will be
    // automatically synced when the document is saved
    category: {
        type: String,
        enum: ['Men', 'Women', 'Kids']
    },
    // per-color stock information (optional). when present the pre-save hook
    // will aggregate these values into the `stock` field for quick queries.
    stockByColor: [{
        color: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        }
    }],
    sizes: [{
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y']
    }],
    colors: [{
        type: String
    }],
    images: [{
        type: String,
        required: [true, 'At least one product image is required']
    }],
    modelUrl: {
        type: String,
        default: null
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// keep the legacy `category` field in sync with the first element of
// `categories` whenever a document is saved/updated
// when saving normally, keep legacy fields in sync
productSchema.pre('save', function(next) {
    if (this.categories && this.categories.length > 0) {
        this.category = this.categories[0];
    } else {
        this.category = undefined;
    }

    // if stockByColor entries exist, compute total stock as their sum
    if (this.stockByColor && this.stockByColor.length > 0) {
        this.stock = this.stockByColor.reduce(
            (sum, s) => sum + (typeof s.stock === 'number' ? s.stock : 0),
            0
        );
    }
    next();
});

// same logic for update operations that use findOneAndUpdate
productSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate() || {};
    if (update.categories) {
        update.category = Array.isArray(update.categories) && update.categories.length > 0
            ? update.categories[0]
            : undefined;
    }
    if (update.stockByColor) {
        // calculate total stock from supplied array
        const total = update.stockByColor.reduce(
            (sum, s) => sum + (s && typeof s.stock === 'number' ? s.stock : 0),
            0
        );
        update.stock = total;
    }
    next();
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
    return this.price * (1 - this.discount / 100);
});

const Product = mongoose.model('Product', productSchema);
export default Product;