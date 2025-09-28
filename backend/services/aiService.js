// backend/services/aiService.js
import axios from 'axios';

/**
 * AI Verification Service Client
 *
 * This function now sends report data to a dedicated, external AI microservice
 * for verification.
 */
export const verifyReport = async (reportData) => {
    try {
        // 1. Send the report text to the AI service endpoint.
        console.log('Sending report to AI service for verification...');
        const response = await axios.post(process.env.AI_SERVICE_URL, {
            text: reportData.text,
        });

        // 2. Return the verdict from the AI service.
        console.log('AI Service responded:', response.data);
        return response.data; // Expected format: { verified: boolean, confidence: float, reason: string }

    } catch (error) {
        // 3. IMPORTANT: If the AI service is down or fails, we don't crash.
        // We log the error and return a default "pending" status.
        // This makes our system resilient.
        console.error('AI Service is unavailable or returned an error:', error.message);
        return {
            verified: false,
            confidence: 0.5, // Neutral confidence
            reason: 'AI service was unavailable. Report requires manual review.',
        };
    }
};