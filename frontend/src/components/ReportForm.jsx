import React, { useState } from 'react';
import axios from 'axios';

const ReportForm = () => {
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (text.length < 10) {
            setMessage('Error: Report text must be at least 10 characters long.');
            return;
        }
        setSubmitting(true);
        setMessage('');

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const payload = { text, lat: latitude, lng: longitude };
                await axios.post('http://localhost:5000/api/reports', payload);
                setMessage('Report submitted successfully!');
                setText('');
            } catch (error) {
                setMessage(`Error: ${error.response?.data?.message || error.message}`);
            } finally {
                setSubmitting(false);
            }
        }, (error) => {
            setMessage('Error: Could not get location. Please enable location services.');
            setSubmitting(false);
        });
    };

    return (
        <form onSubmit={handleSubmit} className="report-form">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe the situation..."
                required
            />
            <button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
            {message && <p className="form-message">{message}</p>}
        </form>
    );
};

export default ReportForm;