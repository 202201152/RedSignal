import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
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
        // -- NEWLY ADDED FIELDS --
        // -- NEWLY ADDED FIELDS --
        imageUrls: {
            type: [String], // Array of URLs
            default: [],
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