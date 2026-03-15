// backend/src/routes/contactRoutes.js
import express from 'express';
import { 
    createContact, 
    getAllContacts, 
    getContactById,
    replyContact,
    deleteContact,
    getContactStats
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - create contact message (must be first)
router.post('/', createContact);

// Admin routes (more specific routes first)
router.get('/stats', protect, admin, getContactStats);

// Get single message (specific ID routes before generic routes)
router.get('/:id', protect, admin, getContactById);
router.put('/:id', protect, admin, replyContact);
router.delete('/:id', protect, admin, deleteContact);

// Get all messages (generic route last)
router.get('/', protect, admin, getAllContacts);

export default router;
