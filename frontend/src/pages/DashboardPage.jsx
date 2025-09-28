import React, { useState, useEffect } from 'react';
// -- 1. ADD 'Link' TO THE IMPORT --
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

import MapComponent from '../components/MapComponent';
import ReportForm from '../components/ReportForm';

const socket = io('http://localhost:5000');

const DashboardPage = () => {
    const [reports, setReports] = useState([]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch initial reports when the component mounts
        const fetchReports = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/reports');
                const data = await response.json();
                setReports(data);
            } catch (error) {
                console.error("Failed to fetch reports:", error);
            }
        };
        fetchReports();

        // Get user's location and join the corresponding room
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                socket.emit('join_location_room', { lat: latitude, lng: longitude });
            },
            (error) => console.error("Could not get user location.", error)
        );

        // Listen for new reports
        socket.on('new-report', (newReport) => {
            setReports(prevReports => [newReport, ...prevReports]);
        });

        // Listen for SOS alerts
        socket.on('new-sos', (sosData) => {
            alert(`!!! SOS ALERT !!!\nFrom: ${sosData.name}\nMessage: ${sosData.message}`);
        });

        // Cleanup listeners on component unmount
        return () => {
            socket.off('new-report');
            socket.off('new-sos');
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <header style={{ background: '#282c34', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Disaster Alert Platform</h1>
                <div>
                    <span>Welcome, {user?.name || 'User'}</span>

                    {/* -- 2. ADD THIS CONDITIONAL LINK -- */}
                    {user?.role === 'admin' && (
                        <Link to="/admin" style={{ marginLeft: '1rem', color: '#63b3ed', textDecoration: 'underline' }}>
                            Admin Panel
                        </Link>
                    )}

                    <button onClick={handleLogout} style={{ marginLeft: '1rem', background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                        Logout
                    </button>
                </div>
            </header>
            <main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <div style={{ flex: 3, position: 'relative' }}>
                    <MapComponent reports={reports} />
                </div>
                <div style={{ flex: 1, padding: '1rem', borderLeft: '1px solid #ccc', overflowY: 'auto' }}>
                    <ReportForm />
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;