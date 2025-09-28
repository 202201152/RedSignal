// backend/controllers/statsController.js
import Report from '../models/Report.js';
import User from '../models/User.js';
import Resource from '../models/Resource.js';

// @desc    Get dashboard statistics
// @route   GET /api/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
    try {
        // We run all our database queries in parallel for efficiency.
        const [
            totalUsers,
            totalReports,
            totalResources,
            reportStatusCounts,
        ] = await Promise.all([
            User.countDocuments(),
            Report.countDocuments(),
            Resource.countDocuments(),
            // Use MongoDB's Aggregation Framework to count reports by status
            Report.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ])
        ]);

        // Format the reportStatusCounts into a more friendly object
        const reportStats = reportStatusCounts.reduce((acc, status) => {
            acc[status._id] = status.count;
            return acc;
        }, {});

        // Send the complete stats object as the response
        res.status(200).json({
            totalUsers,
            totalReports,
            totalResources,
            reportStats, // e.g., { pending: 10, verified: 5 }
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};