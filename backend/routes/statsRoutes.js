// backend/routes/statsRoutes.js

import express from 'express';
import { getStats } from '../controllers/statsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route is protected and can only be accessed by admins.
router.route('/').get(protect, admin, getStats);

export default router;