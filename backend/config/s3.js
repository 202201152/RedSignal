
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import 'dotenv/config';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Check if Config is Missing
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME || !process.env.AWS_REGION) {
    console.error("❌ AWS configuration is missing from environment variables!");
}

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            // Create unique file name: disaster_reports/image-123456789.jpg
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            // Simple extension extraction
            const ext = file.mimetype.split('/')[1] || 'jpg';
            cb(null, `disaster_reports/${file.fieldname}-${uniqueSuffix}.${ext}`);
        }
    }),
    limits: {
        fileSize: 15 * 1024 * 1024 // 15 MB limit
    },
    fileFilter: (req, file, cb) => {
        const isImage = file.mimetype.startsWith('image/');

        if (isImage && file.size > 15 * 1024 * 1024) {
            return cb(new Error('Image size exceeds the 15 MB limit.'), false);
        }

        if (!isImage) {
            return cb(new Error('Only image files are allowed!'), false);
        }

        cb(null, true);
    }
});

export default upload;
