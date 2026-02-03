import express from 'express';
import { createReport, getReports, verifyReport } from '../controllers/reportsController.js';
import { validateReport } from '../middleware/validationMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../config/cloudinary.js'; // <-- 1. IMPORT the Cloudinary middleware

const router = express.Router();

// -- 2. UPDATE the POST route to include the upload middleware --
router.route('/')
    .post(
        protect,
        upload.array('images', 5), // Allow up to 5 images
        validateReport,
        createReport
    )
    .get(getReports);

router.route('/:id/verify').put(protect, admin, verifyReport);

export default router;