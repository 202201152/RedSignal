import express from 'express';
import { createReport, getReports } from '../controllers/reportsController.js';
import { validateReport } from '../middleware/validationMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add the middleware here. Requests will now go through validateReport FIRST.
// If validation passes, it will then proceed to createReport.
router.route('/').post(protect, validateReport, createReport).get(getReports);

export default router;