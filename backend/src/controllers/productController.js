// backend/src/controllers/productController.js
import Product from '../models/Product.js';
import { validationResult } from 'express-validator';
import { cloudinary } from '../utils/cloudinary.js';

// @desc    Get all products with filtering
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const pageSize = 12;
        const page = Number(req.query.page) || 1;
        
        // Build filter query
        const filter = {};
        
        // Category filter (products can belong to multiple categories)
        if (req.query.category) {
            // match products that either belong to the requested value in the new
            // `categories` array or still have the old singular `category` field
            filter.$or = [
                { categories: req.query.category },
                { category: req.query.category }
            ];
        }
        
        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
        }
        
        // Size filter
        if (req.query.size) {
            filter.sizes = req.query.size;
        }
        
        // Color filter
        if (req.query.color) {
            filter.colors = req.query.color;
        }
        
        // Search filter
        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: 'i' };
        }

        // Build sort query
        let sort = {};
        if (req.query.sort) {
            switch (req.query.sort) {
                case 'price-low':
                    sort = { price: 1 };
                    break;
                case 'price-high':
                    sort = { price: -1 };
                    break;
                case 'newest':
                    sort = { createdAt: -1 };
                    break;
                case 'rating':
                    sort = { rating: -1 };
                    break;
                default:
                    sort = { createdAt: -1 };
            }
        }

        // Get total count
        const totalCount = await Product.countDocuments(filter);
        
        // Get products with pagination
        const products = await Product.find(filter)
            .sort(sort)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({
            products,
            page,
            pages: Math.ceil(totalCount / pageSize),
            totalCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ isFeatured: true }).limit(8);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        // support both new and legacy field names
        const products = await Product.find({
            $or: [
                { categories: category },
                { category: category }
            ]
        });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Upload product images (Admin only)
// @route   POST /api/products/:id/images
// @access  Private/Admin
export const uploadProductImages = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images uploaded' });
        }

        // Get image URLs from Cloudinary
        const imageUrls = req.files.map(file => file.path);
        
        // Add new images to existing ones
        product.images = [...product.images, ...imageUrls];
        await product.save();

        res.json({ 
            message: 'Images uploaded successfully',
            images: product.images 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Upload product 3D model (Admin only)
// @route   POST /api/products/:id/model
// @access  Private/Admin
export const uploadProductModel = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No model file uploaded' });
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'dhananjayan-fashions/models',
                    resource_type: 'raw',
                    public_id: `model_${product._id}_${Date.now()}`
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        // Update product model URL
        product.modelUrl = result.secure_url;
        await product.save();

        res.json({ 
            message: '3D model uploaded successfully',
            modelUrl: product.modelUrl 
        });
    } catch (error) {
        console.error('Model upload error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};