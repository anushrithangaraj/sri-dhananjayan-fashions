// Temporary script to make a user admin
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const makeAdmin = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOneAndUpdate(
            { email: 'admin@example.com' },
            { role: 'admin' },
            { new: true }
        );

        if (user) {
            console.log('User updated to admin:', user);
        } else {
            console.log('User not found');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

makeAdmin();