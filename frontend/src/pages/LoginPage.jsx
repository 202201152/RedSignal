import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Auth.css';

const LoginPage = () => {
    // 1. State for form inputs, loading, and errors
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 2. Handler for input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 4. Send login request to the backend
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);

            // 5. On success, store the token in Local Storage
            const { token } = response.data;
            localStorage.setItem('userToken', token);

            // 6. Set the auth token for all future axios requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // 7. Redirect to the dashboard
            navigate('/dashboard');

        } catch (err) {
            // 8. If an error occurs, display it
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Left Panel */}
            <div className="image-panel" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593432336332-7d842d2a9d3a?q=80&w=2574&auto.format&fit.crop')" }}>
                <div className="image-panel-content">
                    <h1>Real-Time Disaster Alert</h1>
                    <p>Your trusted platform for critical, real-time information and coordination during emergencies.</p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="form-panel">
                <div className="form-content">
                    <h2>Welcome Back</h2>
                    <p>Please enter your details to sign in.</p>

                    <form onSubmit={handleSubmit} noValidate>
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
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    <p className="auth-switch-text">
                        Don't have an account?{' '}
                        <Link to="/signup">Sign up now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;