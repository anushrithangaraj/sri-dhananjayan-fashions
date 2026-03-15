// backend/src/controllers/addressController.js
import Address from '../models/Address.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// @desc    Get all addresses for a user
// @route   GET /api/addresses
// @access  Private
export const getUserAddresses = async (req, res) => {
    try {
        console.log('Fetching addresses for user:', req.user._id);
        const addresses = await Address.find({ user: req.user._id }).sort({ createdAt: -1 });
        console.log('Found addresses:', addresses.length);
        res.json(addresses);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single address
// @route   GET /api/addresses/:id
// @access  Private
export const getAddressById = async (req, res) => {
    try {
        const address = await Address.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.json(address);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new address
// @route   POST /api/addresses
// @access  Private
export const createAddress = async (req, res) => {
    try {
        console.log('Creating address for user:', req.user._id);
        console.log('Address data:', req.body);
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullName, address, city, postalCode, country, phone, label, isDefault } = req.body;

        // If this is the default address, unset other defaults
        if (isDefault) {
            await Address.updateMany(
                { user: req.user._id },
                { isDefault: false }
            );
        }

        const newAddress = await Address.create({
            user: req.user._id,
            fullName,
            address,
            city,
            postalCode,
            country,
            phone,
            label: label || 'Home',
            isDefault: isDefault || false
        });

        console.log('Created address:', newAddress);

        // Add address to user's addresses array
        await User.findByIdAndUpdate(req.user._id, {
            $push: { addresses: newAddress._id }
        });

        res.status(201).json(newAddress);
    } catch (error) {
        console.error('Error creating address:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update an address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req, res) => {
    try {
        const address = await Address.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        const { fullName, address: addr, city, postalCode, country, phone, label, isDefault } = req.body;

        // If setting as default, unset other defaults
        if (isDefault && !address.isDefault) {
            await Address.updateMany(
                { user: req.user._id, _id: { $ne: req.params.id } },
                { isDefault: false }
            );
        }

        const updatedAddress = await Address.findByIdAndUpdate(
            req.params.id,
            {
                fullName,
                address: addr,
                city,
                postalCode,
                country,
                phone,
                label,
                isDefault
            },
            { new: true }
        );

        res.json(updatedAddress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        await address.deleteOne();

        // Remove address from user's addresses array
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { addresses: req.params.id }
        });

        res.json({ message: 'Address removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Set default address
// @route   PUT /api/addresses/:id/default
// @access  Private
export const setDefaultAddress = async (req, res) => {
    try {
        const address = await Address.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Unset all other defaults
        await Address.updateMany(
            { user: req.user._id },
            { isDefault: false }
        );

        // Set this as default
        address.isDefault = true;
        await address.save();

        res.json({ message: 'Default address updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};