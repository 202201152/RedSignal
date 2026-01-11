import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import connectDB from './config/db.js';
import reportRoutes from './routes/reportRoutes.js';
import authRoutes from './routes/authRoutes.js';
import sosRoutes from './routes/sosRoutes.js';
// -- NEWLY ADDED --
import { getRoomNameFromCoords } from './utils/locationUtils.js';
import resourceRoutes from './routes/resourceRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

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
app.use(compression()); // Gzip compression
app.use(express.json());

// Middleware to attach Socket.IO to every request
app.use((req, res, next) => {
    req.io = io;
    next();
});

// API Routes
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/stats', statsRoutes);

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('A user connected via WebSocket:', socket.id);

    // -- NEWLY ADDED LOGIC --
    // Listen for a client wanting to join a room based on their location
    socket.on('join_location_room', ({ lat, lng }) => {
        if (lat && lng) {
            const roomName = getRoomNameFromCoords(lat, lng);
            socket.join(roomName);
            console.log(`Socket ${socket.id} joined room: ${roomName}`);
        }
    });
    // -- END OF NEW LOGIC --

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));