// backend/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import 'dotenv/config'; // Ensure env vars are loaded before config


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

if (!process.env.CLOUDINARY_API_KEY) {
    console.error("❌ CLOUDINARY_API_KEY is missing from environment variables!");
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'disaster_reports',
        resource_type: 'image', // Only images
        allowed_formats: ['jpeg', 'jpg', 'png', 'webp']
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 15 * 1024 * 1024 // 15 MB limit
    },
    fileFilter: (req, file, cb) => {
        // Custom validation for file size based on type
        const isImage = file.mimetype.startsWith('image/');

        if (isImage && file.size > 15 * 1024 * 1024) { // 15 MB for images
            return cb(new Error('Image size exceeds the 15 MB limit.'), false);
        }

        if (!isImage) {
            return cb(new Error('Only image files are allowed!'), false);
        }

        cb(null, true);
    }
});

export default upload;