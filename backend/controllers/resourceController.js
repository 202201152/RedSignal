// backend/controllers/resourceController.js
import Resource from '../models/Resource.js';

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private/NGO
export const createResource = async (req, res) => {
    try {
        const { resourceType, description, quantity, lat, lng } = req.body;

        const resource = new Resource({
            resourceType,
            description,
            quantity,
            location: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            ngoId: req.user._id, // Link to the logged-in NGO user
        });

        const createdResource = await resource.save();
        res.status(201).json(createdResource);
    } catch (error) {
        console.error('Error creating resource:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all available resources, with optional geo-filter
// @route   GET /api/resources
// @access  Public
export const getResources = async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;
        let query = { status: 'Available' };

        if (lat && lng && radius) {
            const radiusInMeters = parseFloat(radius) * 1000;
            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)],
                    },
                    $maxDistance: radiusInMeters,
                },
            };
        }

        const resources = await Resource.find(query).populate('ngoId', 'name email');
        res.status(200).json(resources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};