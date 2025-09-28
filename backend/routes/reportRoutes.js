import express from 'express';
import { createReport, getReports, verifyReport } from '../controllers/reportsController.js';
import { validateReport } from '../middleware/validationMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, validateReport, createReport).get(getReports);
router.route('/:id/verify').put(protect, admin, verifyReport);

export default router;