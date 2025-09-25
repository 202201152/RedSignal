import express from 'express';
import { createReport, getReports } from '../controllers/reportsController.js';
import { validateReport } from '../middleware/validationMiddleware.js'; // <-- IMPORT

const router = express.Router();

// Add the middleware here. Requests will now go through validateReport FIRST.
// If validation passes, it will then proceed to createReport.
router.route('/').post(validateReport, createReport).get(getReports);

export default router;