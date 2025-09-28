import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Auth.css';

const SignupPage = () => {
    // 1. State for form inputs, loading status, and errors
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 2. Hook for programmatic navigation
    const navigate = useNavigate();

    // 3. Handler to update state when user types
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 4. Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 5. Send a POST request to the backend signup endpoint
            const response = await axios.post('http://localhost:5000/api/auth/signup', formData);

            console.log('Signup successful:', response.data);
            // 6. On success, redirect to the login page
            navigate('/login');

        } catch (err) {
            // 7. If there's an error, display it
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
            console.error('Signup error:', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Left Panel */}
            <div className="image-panel" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593432336332-7d842d2a9d3a?q=80&w=2574&auto.format&fit=crop')" }}>
                <div className="image-panel-content">
                    <h1>Real-Time Disaster Alert</h1>
                    <p>Your trusted platform for critical, real-time information and coordination during emergencies.</p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="form-panel">
                <div className="form-content">
                    <h2>Create an Account</h2>
                    <p>Join our platform to stay informed and help your community.</p>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-input-group">
                            <label htmlFor="name">Full Name</label>
                            <input id="name" name="name" type="text" required className="form-input" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                        </div>

                        <div className="form-input-group">
                            <label htmlFor="email">Email Address</label>
                            <input id="email" name="email" type="email" required className="form-input" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                        </div>

                        <div className="form-input-group">
                            <label htmlFor="password">Password</label>
                            <input id="password" name="password" type="password" required className="form-input" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                        </div>

                        {/* Display error message if it exists */}
                        {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}

                        <div>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <p className="auth-switch-text">
                        Already have an account?{' '}
                        <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;