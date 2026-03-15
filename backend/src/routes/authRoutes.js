// backend/src/routes/authRoutes.js
import express from 'express';
import { 
    registerUser, 
    loginUser, 
    getProfile, 
    updateProfile 
} from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../utils/validation.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

// Protected routes
router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);

export default router;