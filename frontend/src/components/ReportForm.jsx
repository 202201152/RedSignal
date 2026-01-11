import React, { useState } from 'react';
import axios from 'axios';
import Card from './ui/Card';
import Button from './ui/Button';
import styles from './ReportForm.module.css';
import { FiUpload } from 'react-icons/fi';
import LocationPicker from './LocationPicker';

const ReportForm = () => {
    const [text, setText] = useState('');
    // State for the actual file objects
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    // State for the preview URLs
    const [imagePreview, setImagePreview] = useState('');
    const [videoPreview, setVideoPreview] = useState('');

    // -- LOCATION STATE --
    const [location, setLocation] = useState({ lat: 23.2156, lng: 72.6369 }); // Default
    const [gettingLocation, setGettingLocation] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Load initial location
    React.useEffect(() => {
        if (navigator.geolocation) {
            setGettingLocation(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setGettingLocation(false);
                },
                (err) => {
                    console.error("Location access denied or failed", err);
                    setGettingLocation(false);
                }
            );
        }
    }, []);

    // Handler for file inputs
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        if (!file) return;

        if (name === 'image') {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else if (name === 'video') {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    // Reset form fields after successful submission
    const resetForm = () => {
        setText('');
        setImageFile(null);
        setVideoFile(null);
        setImagePreview('');
        setVideoPreview('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (text.length < 10) {
            setError('Report text must be at least 10 characters long.');
            return;
        }
        setSubmitting(true);
        setMessage('');
        setError('');

        // Use the manually selected or detected location
        const { lat, lng } = location;

        // We must use FormData to send files
        const formData = new FormData();
        formData.append('text', text);
        formData.append('lat', lat);
        formData.append('lng', lng);
        if (imageFile) formData.append('image', imageFile);
        if (videoFile) formData.append('video', videoFile);

        try {
            // Axios automatically sets the correct 'Content-Type' for FormData
            await axios.post('http://localhost:5000/api/reports', formData);
            setMessage('Report submitted successfully!');
            resetForm();
        } catch (err) {
            // Check for specific error message from our backend validation
            setError(err.response?.data?.message || 'Submission failed. Please check file sizes.');
        } finally {
            setSubmitting(false);
        }
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

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Confirm Location (Drag marker to adjust)
                    </label>
                    {gettingLocation && <p style={{ fontSize: '0.8rem' }}>Detecting location...</p>}
                    <LocationPicker
                        initialPosition={location}
                        onLocationSelect={setLocation}
                    />
                </div>

                {/* Image Upload */}
                <div className={styles.fileInputGroup}>
                    <label htmlFor="image-upload" className={styles.fileInputLabel}>
                        <FiUpload />
                        <span>Upload Image (Max 2MB)</span>
                    </label>
                    <input id="image-upload" type="file" name="image" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
                    {imagePreview && <img src={imagePreview} alt="Preview" className={styles.preview} />}
                </div>

                {/* Video Upload */}
                <div className={styles.fileInputGroup}>
                    <label htmlFor="video-upload" className={styles.fileInputLabel}>
                        <FiUpload />
                        <span>Upload Video (Max 50MB)</span>
                    </label>
                    <input id="video-upload" type="file" name="video" accept="video/*" onChange={handleFileChange} className={styles.fileInput} />
                    {videoPreview && <video src={videoPreview} controls className={styles.preview} />}
                </div>

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