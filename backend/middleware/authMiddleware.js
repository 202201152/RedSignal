// backend/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token;

    // 1. Read the token from the 'Authorization' header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Get the token from the header (it's in the format "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify the token using our JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Find the user in the DB and attach them to the request object
            // We exclude the password from the user object for security
            req.user = await User.findById(decoded.userId).select('-password');

            // 5. Move on to the next function (the controller)
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
            return; // Stop execution
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export { protect };