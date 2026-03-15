// backend/src/controllers/contactController.js
import Contact from '../models/Contact.js';

// @desc    Create contact message
// @route   POST /api/contact
// @access  Public
export const createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Validate message length
        if (message.length < 10) {
            return res.status(400).json({ message: 'Message must be at least 10 characters' });
        }

        // Create contact message
        const contact = await Contact.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim()
        });

        res.status(201).json({
            message: 'Message sent successfully! We\'ll get back to you soon.',
            contact
        });
    } catch (error) {
        console.error('Contact creation error:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message,
            details: error.errors ? Object.keys(error.errors).map(key => error.errors[key].message) : []
        });
    }
};

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({}).sort('-createdAt');
        res.json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get contact message by ID (Admin only)
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact message not found' });
        }

        // Mark as read
        if (contact.status === 'New') {
            contact.status = 'Read';
            await contact.save();
        }

        res.json(contact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Reply to contact message (Admin only)
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const replyContact = async (req, res) => {
    try {
        const { reply } = req.body;

        if (!reply) {
            return res.status(400).json({ message: 'Please provide a reply' });
        }

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact message not found' });
        }

        contact.reply = reply;
        contact.status = 'Replied';
        await contact.save();

        res.json({
            message: 'Reply sent successfully',
            contact
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete contact message (Admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact message not found' });
        }

        await Contact.findByIdAndDelete(req.params.id);

        res.json({ message: 'Contact message deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get contact stats (Admin only)
// @route   GET /api/contact/stats
// @access  Private/Admin
export const getContactStats = async (req, res) => {
    try {
        const totalMessages = await Contact.countDocuments();
        const newMessages = await Contact.countDocuments({ status: 'New' });
        const readMessages = await Contact.countDocuments({ status: 'Read' });
        const repliedMessages = await Contact.countDocuments({ status: 'Replied' });

        res.json({
            totalMessages,
            newMessages,
            readMessages,
            repliedMessages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
