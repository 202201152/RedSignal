import express from 'express';
import dotenv from 'dotenv';
import reportRoutes from './routes/reportRoutes.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.use('/api/reports', reportRoutes);
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('API is running successfully!');
});

// backend/server.js
app.use((req, res, next) => {
    req.io = io; // Attaching the io instance to the request object
    next();
});


app.listen(PORT, () => {
    console.log(`✅ Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});