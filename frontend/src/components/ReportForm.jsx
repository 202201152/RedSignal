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
    const [imageFiles, setImageFiles] = useState([]);
    // State for the preview URLs
    const [imagePreviews, setImagePreviews] = useState([]);


    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Handler for file inputs
    const handleFileChange = (e) => {
        const { files } = e.target;
        if (!files || files.length === 0) return;

        // Convert FileList to Array
        const fileArray = Array.from(files);

        // Limit to 5 images
        if (fileArray.length > 5) {
            setError('You can only upload up to 5 images.');
            return;
        }

        setImageFiles(fileArray);

        // Crate previews
        const newPreviews = fileArray.map(file => URL.createObjectURL(file));
        setImagePreviews(newPreviews);
    };

    // Location State
    const [manualLocation, setManualLocation] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [usingAutoLocation, setUsingAutoLocation] = useState(false);

    // Reset form fields after successful submission
    const resetForm = () => {
        setText('');
        setImageFiles([]);
        setImagePreviews([]);
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

    const [uploadProgress, setUploadProgress] = useState(0);

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
        setUploadProgress(0); // Reset progress
        setMessage('');
        setError('');

        try {

            const { lat, lng } = manualLocation;

            // We must use FormData to send files
            const formData = new FormData();
            formData.append('text', text);
            formData.append('lat', lat);
            formData.append('lng', lng);

            // Append multiple images
            // Note: Use the same key 'images' for each file, backend 'upload.array("images")' expects this.
            imageFiles.forEach(file => {
                formData.append('images', file);
            });

            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

            // Axios automatically sets the correct 'Content-Type' for FormData
            await axios.post(`${API_URL}/api/reports`, formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            setMessage('Report submitted successfully!');
            resetForm();
            setUploadProgress(0);
        } catch (err) {
            // Check for specific error message from our backend validation
            setError(err.response?.data?.message || 'Submission failed. Please check file sizes.');
            setUploadProgress(0);
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
                        <span>Upload Images (Max 5, 15MB each)</span>
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        name="image"
                        accept="image/*"
                        multiple // Allow multiple files
                        onChange={handleFileChange}
                        className={styles.fileInput}
                    />

                    {/* Preview Grid */}
                    {imagePreviews.length > 0 && (
                        <div className={styles.previewGrid}>
                            {imagePreviews.map((src, index) => (
                                <img key={index} src={src} alt={`Preview ${index}`} className={styles.preview} />
                            ))}
                        </div>
                    )}
                </div>

                {error && <p className={styles.error}>{error}</p>}
                {message && <p className={styles.success}>{message}</p>}

                {/* Progress Bar */}
                {submitting && uploadProgress > 0 && (
                    <div className={styles.progressContainer}>
                        <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }}></div>
                        <span className={styles.progressText}>{uploadProgress}% Uploaded</span>
                    </div>
                )}

                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Report'}
                </Button>
            </form>
        </Card>
    );
};

export default ReportForm;