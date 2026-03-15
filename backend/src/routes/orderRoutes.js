// backend/src/routes/orderRoutes.js
import express from 'express';
import { 
    createOrder, 
    getOrderById, 
    getMyOrders, 
    updateOrderStatus,
    getAllOrders,
    cancelOrder,
    deleteOrder
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected user routes
router.route('/')
    .post(protect, createOrder)
    .get(protect, admin, getAllOrders);

router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);
router.delete('/:id', protect, deleteOrder);

// Admin routes
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;