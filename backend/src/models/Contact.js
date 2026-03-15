// backend/src/models/Contact.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        lowercase: true,
        trim: true
    },
    subject: {
        type: String,
        required: [true, 'Please enter a subject'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Please enter your message'],
        trim: true,
        minlength: [10, 'Message must be at least 10 characters']
    },
    status: {
        type: String,
        enum: ['New', 'Read', 'Replied'],
        default: 'New'
    },
    reply: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
