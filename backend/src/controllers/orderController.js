// backend/src/controllers/orderController.js
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            addressId,
            paymentMethod,
            itemsPrice,
            gstAmount,
            totalPrice
        } = req.body;

        // Validate items and check stock (taking color-specific inventory into account)
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.name}` });
            }
            let available = product.stock;
            if (item.color && product.stockByColor && product.stockByColor.length > 0) {
                const entry = product.stockByColor.find(s => s.color === item.color);
                available = entry ? entry.stock : 0;
            }
            if (available < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}${item.color ? ' (' + item.color + ')' : ''}. Available: ${available}`
                });
            }
        }

        // Handle shipping address
        let finalShippingAddress = shippingAddress;
        if (addressId) {
            // Fetch saved address
            const Address = (await import('../models/Address.js')).default;
            const savedAddress = await Address.findOne({
                _id: addressId,
                user: req.user._id
            });

            if (!savedAddress) {
                return res.status(404).json({ message: 'Saved address not found' });
            }

            finalShippingAddress = {
                fullName: savedAddress.fullName,
                address: savedAddress.address,
                city: savedAddress.city,
                postalCode: savedAddress.postalCode,
                country: savedAddress.country,
                phone: savedAddress.phone
            };
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress: finalShippingAddress,
            paymentMethod,
            itemsPrice,
            gstAmount,
            totalPrice
        });

        // Update product stock
        for (const item of items) {
            if (item.color) {
                // decrement color-specific stock and overall stock
                await Product.findByIdAndUpdate(item.product, {
                    $inc: {
                        'stockByColor.$[elem].stock': -item.quantity,
                        stock: -item.quantity
                    }
                }, {
                    arrayFilters: [{ 'elem.color': item.color }]
                });
            } else {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to view this order
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id, deletedByUser: false })
            .sort('-createdAt');
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ deletedByAdmin: false })
            .populate('user', 'id name email')
            .sort('-createdAt');
        
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Cancel order (User only - for their own orders)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to cancel this order
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        // Check if order can be cancelled (only Pending or Processing)
        if (order.status !== 'Pending' && order.status !== 'Processing') {
            return res.status(400).json({ 
                message: `Cannot cancel order with status ${order.status}. Only Pending or Processing orders can be cancelled.` 
            });
        }

        // Restore product stock (color-specific if applicable)
        for (const item of order.items) {
            if (item.color) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: {
                        'stockByColor.$[elem].stock': item.quantity,
                        stock: item.quantity
                    }
                }, {
                    arrayFilters: [{ 'elem.color': item.color }]
                });
            } else {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity }
                });
            }
        }

        // Update order status
        order.status = 'Cancelled';
        await order.save();

        res.json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete cancelled order
// @route   DELETE /api/orders/:id
// @access  Private (User can delete own cancelled orders, Admin can delete any cancelled order)
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order is cancelled
        if (order.status !== 'Cancelled') {
            return res.status(400).json({ 
                message: 'Only cancelled orders can be deleted' 
            });
        }

        // Check if user is authorized to delete this order
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this order' });
        }

        // Set appropriate deletion flag based on user role
        if (req.user.role === 'admin') {
            order.deletedByAdmin = true;
        } else {
            order.deletedByUser = true;
        }

        await order.save();

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};