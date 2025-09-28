// backend/models/Resource.js

import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
    {
        // Link to the NGO user who posted this resource
        ngoId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        resourceType: {
            type: String,
            required: true,
            enum: ['Food', 'Water', 'Shelter', 'Medical', 'Rescue', 'Other'],
        },
        description: {
            type: String,
            required: true,
        },
        quantity: {
            type: String, // Using String for flexibility (e.g., "100 meals", "5 tents")
            required: true,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
            },
        },
        status: {
            type: String,
            enum: ['Available', 'Depleted'],
            default: 'Available',
        },
    },
    {
        timestamps: true,
    }
);

// Add the geospatial index for location-based searching
resourceSchema.index({ location: '2dsphere' });

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;