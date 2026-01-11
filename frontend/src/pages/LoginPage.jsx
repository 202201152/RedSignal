import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './styles/Auth.css';
import { FiMail, FiLock } from 'react-icons/fi';

const LoginPage = () => {
    const { login } = useAuth();
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

        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, formData);
            login(response.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p>Sign in to continue to the platform.</p>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="input-wrapper">
                        <FiMail className="input-icon" />
                        <input id="email" name="email" type="email" required className="form-input" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="input-wrapper">
                        <FiLock className="input-icon" />
                        <input id="password" name="password" type="password" required className="form-input" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                    </div>

                    {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="auth-switch-text">
                    Don't have an account?{' '}
                    <Link to="/signup">Sign up now</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;