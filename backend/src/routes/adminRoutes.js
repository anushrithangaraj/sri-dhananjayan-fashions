// backend/src/routes/adminRoutes.js
import express from 'express';
import { 
    getDashboardStats, 
    getAllUsers, 
    deleteUser 
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes are protected and require admin role
router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

export default router;