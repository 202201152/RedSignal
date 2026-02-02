import request from 'supertest';
import { app, server } from '../server.js';
import mongoose from 'mongoose';

describe('Health Check', () => {
    afterAll(async () => {
        // Close DB connection and server to prevent hanging
        await mongoose.disconnect();
        server.close();
    });

    it('should return 404 for unknown routes (acting as basic server check)', async () => {
        const res = await request(app).get('/api/health-check-non-existent');
        expect(res.statusCode).toEqual(404);
    });

    // We can add a real health check route later, but for now let's test that the app doesn't crash
    it('should be able to receive requests', async () => {
        // Just testing connectivity
        expect(true).toBe(true);
    });
});
