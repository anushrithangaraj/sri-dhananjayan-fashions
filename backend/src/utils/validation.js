// backend/src/utils/validation.js
import { body } from 'express-validator';

// User validation rules
export const validateRegister = [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

export const validateLogin = [
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
];

// Product validation rules
export const validateProduct = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number').custom(value => value > 0),
    body('categories')
        .isArray({ min: 1 })
        .withMessage('Categories must be an array with at least one value')
        .custom(arr => arr.every(c => ['Men', 'Women', 'Kids'].includes(c)))
        .withMessage('Invalid category in list'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative number'),
    body('stockByColor')
        .optional()
        .isArray()
        .withMessage('stockByColor must be an array')
        .custom(arr => arr.every(item =>
            item && typeof item.color === 'string' &&
            typeof item.stock === 'number' && item.stock >= 0
        ))
        .withMessage('Each stockByColor entry must have a valid color and non-negative stock'),
    body('sizes').isArray().withMessage('Sizes must be an array'),
    body('colors').isArray().withMessage('Colors must be an array')
];

// Order validation rules
export const validateOrder = [
    body('items').isArray().withMessage('Items must be an array').notEmpty(),
    body('addressId').optional().isMongoId().withMessage('Invalid address ID'),
    body('shippingAddress').if(body('addressId').not().exists()).custom((value) => {
        if (!value || !value.fullName || !value.address || !value.city || !value.postalCode || !value.country || !value.phone) {
            throw new Error('Shipping address is required when addressId is not provided');
        }
        return true;
    }),
    body('shippingAddress.fullName').optional().notEmpty().withMessage('Full name is required'),
    body('shippingAddress.address').optional().notEmpty().withMessage('Address is required'),
    body('shippingAddress.city').optional().notEmpty().withMessage('City is required'),
    body('shippingAddress.postalCode').optional().notEmpty().withMessage('Postal code is required'),
    body('shippingAddress.country').optional().notEmpty().withMessage('Country is required'),
    body('shippingAddress.phone').optional().notEmpty().withMessage('Phone number is required')
];

// Address validation rules
export const validateAddress = [
    body('fullName').notEmpty().withMessage('Full name is required').trim(),
    body('address').notEmpty().withMessage('Address is required').trim(),
    body('city').notEmpty().withMessage('City is required').trim(),
    body('postalCode').notEmpty().withMessage('Postal code is required').trim(),
    body('country').notEmpty().withMessage('Country is required').trim(),
    body('phone').notEmpty().withMessage('Phone number is required').trim(),
    body('label').optional().isIn(['Home', 'Work', 'Other']).withMessage('Invalid label')
];