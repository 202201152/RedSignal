import Report from '../models/Report.js';

// This function is correct and remains unchanged.
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
        });

        const savedReport = await newReport.save();
        req.io.emit('new-report', savedReport);

        res.status(201).json(savedReport);

    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ message: 'Server error. Could not create report.' });
    }
};

// -- THIS FUNCTION HAS BEEN UPGRADED --
// It now checks for location data in the URL to perform a geospatial search.
export const getReports = async (req, res) => {
    try {
        // Check for latitude, longitude, and radius in the query string
        const { lat, lng, radius } = req.query;

        let query = {};

        // If all three are provided, build a geospatial query
        if (lat && lng && radius) {
            // Convert radius from kilometers to meters for MongoDB
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

        // If no location data, the query object is empty and returns all reports.
        // Otherwise, it returns only the reports that match the location query.
        const reports = await Report.find(query).sort({ createdAt: -1 });

        res.status(200).json(reports);

    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Server error. Could not fetch reports.' });
    }
};

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