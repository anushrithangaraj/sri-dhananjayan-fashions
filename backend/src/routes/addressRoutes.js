// backend/src/routes/addressRoutes.js
import express from 'express';
import {
    getUserAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} from '../controllers/addressController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateAddress } from '../utils/validation.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
    .get(getUserAddresses)
    .post(validateAddress, createAddress);

router.route('/:id')
    .get(getAddressById)
    .put(validateAddress, updateAddress)
    .delete(deleteAddress);

router.put('/:id/default', setDefaultAddress);

export default router;