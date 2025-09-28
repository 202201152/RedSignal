// frontend/src/components/NgoRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NgoRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Allow access if the user is an 'ngo' or an 'admin'
    if (user?.role !== 'ngo' && user?.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default NgoRoute;