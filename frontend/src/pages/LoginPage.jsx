import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // <-- 1. Import useAuth
import './styles/Auth.css';

const LoginPage = () => {
    const { login } = useAuth(); // <-- 2. Get the login function from our context
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);

            // 3. Use the context's login function.
            // This will handle setting the token in state and local storage.
            login(response.data);

            navigate('/dashboard');

        } catch (err) {
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