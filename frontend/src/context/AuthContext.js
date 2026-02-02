// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('userToken') || null);

    useEffect(() => {
        // This effect runs when the app loads to keep the user logged in
        const userToken = localStorage.getItem('userToken');
        const savedUser = localStorage.getItem('userData');

        if (userToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
            setToken(userToken);
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('userToken', userData.token);
        localStorage.setItem('userData', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        setToken(userData.token);
        setUser(userData); // Set user data on login
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};