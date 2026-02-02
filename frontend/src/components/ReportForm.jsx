import React, { useState } from 'react';
import axios from 'axios';
import Card from './ui/Card';
import Button from './ui/Button';
import styles from './ReportForm.module.css';
import { FiUpload, FiMapPin } from 'react-icons/fi';
import LocationPickerMap from './LocationPickerMap';

const ReportForm = () => {
    const [text, setText] = useState('');
    // State for the actual file objects
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    // State for the preview URLs
    const [imagePreview, setImagePreview] = useState('');
    const [videoPreview, setVideoPreview] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Handler for file inputs
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        if (!file) return;

        if (name === 'image') {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    // Location State
    const [manualLocation, setManualLocation] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [usingAutoLocation, setUsingAutoLocation] = useState(false);

    // Reset form fields after successful submission
    const resetForm = () => {
        setText('');
        setImageFile(null);
        setVideoFile(null);
        setImagePreview('');
        setVideoPreview('');
        setManualLocation(null);
        setShowMap(false);
    };

    const handleLocationSelect = (latlng) => {
        setManualLocation(latlng);
        setUsingAutoLocation(false);
    };

    const handleAutoLocation = () => {
        setUsingAutoLocation(true);
        setShowMap(false);
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            setUsingAutoLocation(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setManualLocation({ lat: latitude, lng: longitude });
                // We don't necessarily show the map here, just set the coords
                setMessage('Location detected successfully!');
                setTimeout(() => setMessage(''), 3000);
                setUsingAutoLocation(false);
            },
            (err) => {
                console.error(err);
                setError('Could not get location. Please enable location services or use the map.');
                setUsingAutoLocation(false);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (text.length < 10) {
            setError('Report text must be at least 10 characters long.');
            return;
        }
        if (!manualLocation) {
            setError('Please select a location using the map or "Use My Location" button.');
            return;
        }

        setSubmitting(true);
        setMessage('');
        setError('');

        try {
            const { lat, lng } = manualLocation;

            // We must use FormData to send files
            const formData = new FormData();
            formData.append('text', text);
            formData.append('lat', lat);
            formData.append('lng', lng);
            if (imageFile) formData.append('image', imageFile);
            if (videoFile) formData.append('video', videoFile);

            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            // Axios automatically sets the correct 'Content-Type' for FormData
            await axios.post(`${API_URL}/api/reports`, formData);
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

                {/* Location Picker Section */}
                <div className={styles.locationSection}>
                    <p className={styles.label}>Location: {manualLocation ? `Selected (${manualLocation.lat.toFixed(4)}, ${manualLocation.lng.toFixed(4)})` : 'Not Selected'}</p>

                    <div className={styles.locationButtons}>
                        <Button type="button" onClick={handleAutoLocation} disabled={usingAutoLocation} className={styles.secondaryButton}>
                            <FiMapPin /> Use My Location
                        </Button>
                        <Button type="button" onClick={() => setShowMap(!showMap)} className={styles.secondaryButton}>
                            {showMap ? 'Hide Map' : 'Select on Map'}
                        </Button>
                    </div>

                    {showMap && (
                        <div className={styles.mapWrapper}>
                            <LocationPickerMap
                                initialPosition={manualLocation}
                                onLocationSelect={handleLocationSelect}
                            />
                        </div>
                    )}
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