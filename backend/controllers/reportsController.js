import Report from '../models/Report.js';

export const createReport = async (req, res) => {
    try {
        const { text, lat, lng } = req.body;

        const newReport = new Report({
            text: text,
            location: {
                type: 'Point',
                coordinates: [lng, lat],
            },
        });

        const savedReport = await newReport.save();
        req.io.emit('new-report', savedReport);

        res.status(201).json(savedReport);

    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ message: 'Server error. Could not create report.' });
    }
};

export const getReports = async (req, res) => {
    try {
        const reports = await Report.find({}).sort({ createdAt: -1 });

        res.status(200).json(reports);

    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Server error. Could not fetch reports.' });
    }
};