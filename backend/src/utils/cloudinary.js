// backend/src/utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage for images
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'dhananjayan-fashions',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    }
});

// Configure multer for images
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Configure storage for 3D models
const modelStorage = multer.memoryStorage();

// Configure multer for 3D models
const uploadModel = multer({ 
    storage: modelStorage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit for models
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['model/gltf+json', 'model/gltf-binary', 'model/vnd.usdz+zip', 'application/octet-stream'];
        const allowedExtensions = ['.gltf', '.glb', '.usdz', '.obj'];
        
        const fileExt = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
        
        if (allowedExtensions.includes(fileExt) || allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only GLTF, GLB, USDZ, and OBJ files are allowed.'), false);
        }
    }
});

export { cloudinary, upload, uploadModel };