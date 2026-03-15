// backend/src/routes/productRoutes.js
import express from 'express';
import { 
    getProducts, 
    getProductById, 
    getFeaturedProducts,
    getProductsByCategory,
    createProduct, 
    updateProduct, 
    deleteProduct,
    uploadProductImages,
    uploadProductModel
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateProduct } from '../utils/validation.js';
import { upload, uploadModel } from '../utils/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, admin, validateProduct, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/images', protect, admin, upload.array('images', 5), uploadProductImages);
router.post('/:id/model', protect, admin, uploadModel.single('model'), uploadProductModel);

export default router;