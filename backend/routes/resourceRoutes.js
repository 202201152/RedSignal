// backend/routes/resourceRoutes.js

import express from 'express';
import { createResource, getResources } from '../controllers/resourceController.js';
import { protect, ngo } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/resources -> Create a new resource (NGOs/Admins only)
// GET /api/resources -> Get all available resources (Public)
router.route('/')
    .post(protect, ngo, createResource)
    .get(getResources);

export default router;