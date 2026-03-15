// backend/src/controllers/cartController.js
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart) {
            // Create empty cart if none exists
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        // Filter out items with missing/deleted products
        cart.items = cart.items.filter(item => item.product !== null);

        // Save the cart if items were filtered out
        if (cart.isModified()) {
            await cart.save();
        }

        res.json({
            _id: cart._id,
            items: cart.items,
            totalItems: cart.totalItems,
            totalPrice: cart.totalPrice,
            gstAmount: cart.gstAmount
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, selectedSize, selectedColor } = req.body;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check stock availability
        let availableStock = product.stock;
        if (selectedColor && product.stockByColor) {
            const colorStock = product.stockByColor.find(s => s.color === selectedColor);
            if (colorStock) availableStock = colorStock.stock;
        }

        if (quantity > availableStock) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
        );

        if (existingItemIndex > -1) {
            // Update quantity of existing item
            cart.items[existingItemIndex].quantity += quantity;

            // Check if new quantity exceeds stock
            if (cart.items[existingItemIndex].quantity > availableStock) {
                return res.status(400).json({ message: 'Insufficient stock for requested quantity' });
            }
        } else {
            // Add new item
            const cartItem = {
                product: productId,
                name: product.name,
                price: product.price,
                discountedPrice: product.discountedPrice || product.price,
                images: product.images,
                categories: product.categories,
                stock: product.stock,
                stockByColor: product.stockByColor,
                sizes: product.sizes,
                colors: product.colors,
                discount: product.discount || 0,
                quantity,
                selectedSize,
                selectedColor
            };
            cart.items.push(cartItem);
        }

        await cart.save();

        res.json({
            _id: cart._id,
            items: cart.items,
            totalItems: cart.totalItems,
            totalPrice: cart.totalPrice,
            gstAmount: cart.gstAmount
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity, selectedSize, selectedColor } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Check stock availability
        const product = await Product.findById(productId);
        let availableStock = product.stock;
        if (selectedColor && product.stockByColor) {
            const colorStock = product.stockByColor.find(s => s.color === selectedColor);
            if (colorStock) availableStock = colorStock.stock;
        }

        if (quantity > availableStock) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        res.json({
            _id: cart._id,
            items: cart.items,
            totalItems: cart.totalItems,
            totalPrice: cart.totalPrice,
            gstAmount: cart.gstAmount
        });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const { selectedSize, selectedColor } = req.query;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            item => {
                const productMatch = item.product.toString() === productId.toString();
                const sizeMatch = (item.selectedSize || null) === (selectedSize || null);
                const colorMatch = (item.selectedColor || null) === (selectedColor || null);

                return !(productMatch && sizeMatch && colorMatch);
            }
        );

        await cart.save();

        res.json({
            _id: cart._id,
            items: cart.items,
            totalItems: cart.totalItems,
            totalPrice: cart.totalPrice,
            gstAmount: cart.gstAmount
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.json({
            message: 'Cart cleared successfully',
            items: [],
            totalItems: 0,
            totalPrice: 0,
            gstAmount: 0
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};