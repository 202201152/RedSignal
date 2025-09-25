// backend/routes/authRoutes.js

import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js'; // <-- ADD loginUser

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser); // <-- ADD THIS LINE

export default router;