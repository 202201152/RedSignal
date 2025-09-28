import React, { useState } from 'react';
import axios from 'axios';
import Card from './ui/Card';
import Button from './ui/Button';
import styles from './ReportForm.module.css';

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
        <Card title="Submit a Report">
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Describe the situation in detail..."
                    required
                    className={styles.textarea}
                />
                {error && <p className={styles.error}>{error}</p>}
                {message && <p className={styles.success}>{message}</p>}
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Report'}
                </Button>
            </form>
        </Card>
    );
};

export default ReportForm;