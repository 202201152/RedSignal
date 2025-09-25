// backend/controllers/authController.js
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/signup
export const registerUser = async (req, res) => { // <-- Ensure 'export' is here
    // ... your registerUser code
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
export const loginUser = async (req, res) => { // <-- And ensure 'export' is here
    // ... your loginUser code
};