// frontend/src/pages/NgoDashboardPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const NgoDashboardPage = () => {
    const [formData, setFormData] = useState({
        resourceType: 'Water',
        description: '',
        quantity: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        // Get current location to post the resource
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const payload = {
                ...formData,
                lat: latitude,
                lng: longitude,
            };

            try {
                await axios.post('http://localhost:5000/api/resources', payload);
                setMessage('Resource posted successfully!');
                // Reset form
                setFormData({ resourceType: 'Water', description: '', quantity: '' });
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to post resource.');
            } finally {
                setLoading(false);
            }
        }, (err) => {
            setError('Could not get location. Please enable location services.');
            setLoading(false);
        });
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>NGO Panel: Post a Resource</h1>
                <Link to="/dashboard">Back to Main Dashboard</Link>
            </header>

            <form onSubmit={handleSubmit}>
                <div className="form-input-group">
                    <label htmlFor="resourceType">Resource Type</label>
                    <select name="resourceType" id="resourceType" value={formData.resourceType} onChange={handleChange} className="form-input">
                        <option value="Water">Water</option>
                        <option value="Food">Food</option>
                        <option value="Shelter">Shelter</option>
                        <option value="Medical">Medical</option>
                        <option value="Rescue">Rescue</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-input-group">
                    <label htmlFor="description">Description</label>
                    <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} required className="form-input" placeholder="e.g., Bottled water, 500ml" />
                </div>
                <div className="form-input-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input type="text" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} required className="form-input" placeholder="e.g., 200 units" />
                </div>

                {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}
                {message && <p style={{ color: 'green', fontSize: '0.875rem' }}>{message}</p>}

                <button type="submit" className="submit-btn" disabled={loading} style={{ marginTop: '1rem' }}>
                    {loading ? 'Posting...' : 'Post Resource at My Location'}
                </button>
            </form>
        </div>
    );
};

export default NgoDashboardPage;