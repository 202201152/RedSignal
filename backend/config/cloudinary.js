// backend/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'disaster_reports',
        resource_type: 'auto', // Automatically detect if it's an image or video
        allowed_formats: ['jpeg', 'jpg', 'png', 'mp4', 'mov', 'avi']
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50 MB limit for any file
    },
    fileFilter: (req, file, cb) => {
        // Custom validation for file size based on type
        const isImage = file.mimetype.startsWith('image/');
        const isVideo = file.mimetype.startsWith('video/');

        if (isImage && file.size > 2 * 1024 * 1024) { // 2 MB for images
            return cb(new Error('Image size exceeds the 2 MB limit.'), false);
        }
        if (isVideo && file.size > 50 * 1024 * 1024) { // 50 MB for videos
            return cb(new Error('Video size exceeds the 50 MB limit.'), false);
        }
        cb(null, true);
    }
});

export default upload;