// backend/routes/sosRoutes.js

import express from 'express';
import { createSOSAlert } from '../controllers/sosController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only logged-in users can access this route
router.route('/').post(protect, createSOSAlert);

export default router;