// frontend/src/components/ReportForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ReportForm = () => {
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (text.length < 10) {
            setError('Report text must be at least 10 characters long.');
            return;
        }
        setSubmitting(true);
        setMessage('');
        setError('');

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const payload = { text, lat: latitude, lng: longitude };

                // The token is already set in axios defaults by our AuthContext
                await axios.post('http://localhost:5000/api/reports', payload);

                setMessage('Report submitted successfully!');
                setText('');
            } catch (err) {
                setError(err.response?.data?.message || 'Submission failed.');
            } finally {
                setSubmitting(false);
            }
        }, (err) => {
            setError('Could not get location. Please enable location services.');
            setSubmitting(false);
        });
    };

    return (
        <div className="report-form-container">
            <h2>Submit a Report</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Describe the situation..."
                    required
                    style={{ width: '100%', minHeight: '100px', marginBottom: '1rem', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}
                {message && <p style={{ color: 'green', fontSize: '0.875rem' }}>{message}</p>}
                <button type="submit" className="submit-btn" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
            </form>
        </div>
    );
};

export default ReportForm;