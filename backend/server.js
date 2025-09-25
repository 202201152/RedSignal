// backend/server.js

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

import connectDB from './config/db.js';
import reportRoutes from './routes/reportRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO -- MUST be done before the middleware that uses it
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Your React app's origin
        methods: ["GET", "POST"]
    }
});

// General Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Middleware to attach Socket.IO to every request
app.use((req, res, next) => {
    req.io = io;
    next();
});

// API Routes
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);



// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('A user connected via WebSocket:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));