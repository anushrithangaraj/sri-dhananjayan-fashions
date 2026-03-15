// backend/src/routes/userRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get user orders
// @route   GET /api/users/orders
// @access  Private
router.get('/orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product')
            .sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;