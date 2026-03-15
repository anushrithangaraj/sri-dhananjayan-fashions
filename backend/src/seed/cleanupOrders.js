import mongoose from 'mongoose';
import Order from '../models/Order.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanupOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Find and delete the 2 most recent orders
        const ordersToDelete = await Order.find().sort({ createdAt: -1 }).limit(2);

        if (ordersToDelete.length === 0) {
            console.log('No orders found to delete');
            process.exit(0);
        }

        const orderIds = ordersToDelete.map(order => order._id);
        console.log('Deleting orders:', orderIds);

        const result = await Order.deleteMany({ _id: { $in: orderIds } });

        console.log(`Successfully deleted ${result.deletedCount} orders`);
        console.log('Deleted order details:');
        ordersToDelete.forEach(order => {
            console.log(`- Order ID: ${order.orderId}, Customer: ${order.user}, Status: ${order.status}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error deleting orders:', error.message);
        process.exit(1);
    }
};

cleanupOrders();
