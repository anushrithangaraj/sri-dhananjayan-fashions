// backend/src/controllers/adminController.js
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        // Get total users count
        const totalUsers = await User.countDocuments({ role: 'user' });
        
        // Get total products count
        const totalProducts = await Product.countDocuments();
        
        // Get total orders count (excluding deleted by admin)
        const totalOrders = await Order.countDocuments({ deletedByAdmin: false });
        
        // Get total revenue (sum of all delivered orders, excluding deleted)
        const revenueResult = await Order.aggregate([
            { $match: { status: 'Delivered', deletedByAdmin: false } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
        
        // Get recent orders (excluding deleted by admin)
        const recentOrders = await Order.find({ deletedByAdmin: false })
            .populate('user', 'name email')
            .sort('-createdAt')
            .limit(5);
        
        // Get low stock products. a product is considered low if the
        // aggregated stock < 10 or any individual color variant has < 10.
        const lowStockProducts = await Product.find({
            $or: [
                { stock: { $lt: 10 } },
                { 'stockByColor.stock': { $lt: 10 } }
            ]
        })
            .select('name stock stockByColor')
            .limit(5);
        
        // Get orders by status (excluding deleted by admin)
        const ordersByStatus = await Order.aggregate([
            { $match: { deletedByAdmin: false } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue
            },
            recentOrders,
            lowStockProducts,
            ordersByStatus
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin user' });
        }

        await user.deleteOne();
        res.json({ message: 'User removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};