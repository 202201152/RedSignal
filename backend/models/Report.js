

import mongoose from 'mongoose';


const reportSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, 'Report text is required.'],
            trim: true,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        status: {
            type: String,
            enum: ['pending', 'verified', 'fake', 'flagged'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

reportSchema.index({ location: '2dsphere' });

// Create the model from the schema and export it
const Report = mongoose.model('Report', reportSchema);

export default Report;