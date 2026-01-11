// frontend/src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // Function to fetch all reports
    const fetchReports = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/reports`);
            setReports(response.data);
        } catch (err) {
            setError('Failed to fetch reports.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // Function to handle report verification
    const handleVerify = async (reportId) => {
        try {
            await axios.put(`${API_URL}/api/reports/${reportId}/verify`);
            fetchReports();
        } catch (err) {
            alert('Failed to verify report.');
        }
    };



    if (loading) return <p>Loading reports...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Panel: All Reports</h1>
                <Link to="/dashboard">Back to Main Dashboard</Link>
            </header>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
                        <th style={{ padding: '8px' }}>Date</th>
                        <th style={{ padding: '8px' }}>Report Text</th>
                        <th style={{ padding: '8px' }}>Status</th>
                        <th style={{ padding: '8px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report._id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '8px' }}>{new Date(report.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: '8px' }}>{report.text}</td>
                            <td style={{ padding: '8px' }}>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    color: 'white',
                                    backgroundColor: report.status === 'verified' ? '#22c55e' : '#f59e0b'
                                }}>
                                    {report.status}
                                </span>
                            </td>
                            <td style={{ padding: '8px' }}>
                                {report.status === 'pending' && (
                                    <button onClick={() => handleVerify(report._id)} className="submit-btn" style={{ padding: '5px 10px' }}>
                                        Verify
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboardPage;