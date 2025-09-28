// frontend/src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        // If user is not authenticated, redirect to login
        return <Navigate to="/login" />;
    }

    if (user?.role !== 'admin') {
        // If user is not an admin, redirect them to their dashboard
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default AdminRoute;