import Report from '../models/Report.js';

// -- THIS FUNCTION HAS BEEN UPGRADED --
// It now handles file uploads from the 'upload' middleware.
export const createReport = async (req, res) => {
    try {
        const { text, lat, lng } = req.body;

        const newReport = new Report({
            text: text,
            location: {
                type: 'Point',
                coordinates: [lng, lat],
            },
            userId: req.user._id,
            // -- 1. ADD file URLs from the request if they exist --
            // The 'upload' middleware adds a 'files' object to the request.
            // We use optional chaining (?.) to safely access the file paths.
            imageUrl: req.files?.image ? req.files.image[0].path : null,
            videoUrl: req.files?.video ? req.files.video[0].path : null,
        });

        const savedReport = await newReport.save();
        req.io.emit('new-report', savedReport);

        res.status(201).json(savedReport);

    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ message: 'Server error. Could not create report.' });
    }
};

// This function remains unchanged.
export const getReports = async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;
        let query = {};

        if (lat && lng && radius) {
            const radiusInMeters = parseFloat(radius) * 1000;
            query = {
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(lng), parseFloat(lat)],
                        },
                        $maxDistance: radiusInMeters,
                    },
                },
            };
        }
        const reports = await Report.find(query).sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Server error. Could not fetch reports.' });
    }
};

// This function remains unchanged.
export const verifyReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (report) {
            report.status = 'verified';
            const updatedReport = await report.save();
            res.status(200).json(updatedReport);
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        console.error('Error verifying report:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// -- DELETE REPORT FUNCTION --
export const deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (report) {
            await report.deleteOne(); // or remove() depending on Mongoose version, deleteOne is safer
            res.status(200).json({ message: 'Report removed' });
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};