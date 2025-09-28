// backend/controllers/sosController.js
import { getRoomNameFromCoords } from '../utils/locationUtils.js'; // <-- IMPORT

export const createSOSAlert = async (req, res) => {
    try {
        const user = req.user;
        const { message, lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Location (lat, lng) is required.' });
        }

        const sosData = {
            // ... (sosData object remains the same)
        };

        // 1. Determine the correct room for the SOS location
        const roomName = getRoomNameFromCoords(lat, lng);

        // 2. Broadcast the 'new-sos' event ONLY to clients in that specific room
        console.log(`Broadcasting new SOS alert to room: ${roomName}`);
        req.io.to(roomName).emit('new-sos', sosData);

        res.status(200).json({ message: 'SOS alert broadcasted successfully', data: sosData });

    } catch (error) {
        console.error('SOS Alert Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};