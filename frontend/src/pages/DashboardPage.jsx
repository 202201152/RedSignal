// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Layout from '../components/Layout';
import MapComponent from '../components/MapComponent';
import LiveFeed from '../components/dashboard/LiveFeed';
import styles from './styles/DashboardPage.module.css';

const socket = io('http://localhost:5000');

const DashboardPage = () => {
    const [reports, setReports] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [reportsRes, resourcesRes] = await Promise.all([
                    fetch('http://localhost:5000/api/reports'),
                    fetch('http://localhost:5000/api/resources')
                ]);
                const reportsData = await reportsRes.json();
                const resourcesData = await resourcesRes.json();
                setReports(reportsData);
                setResources(resourcesData);
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                socket.emit('join_location_room', { lat: latitude, lng: longitude });
            },
            (error) => console.error("Could not get user location.", error)
        );

        socket.on('new-report', (newReport) => {
            setReports(prevReports => [newReport, ...prevReports]);
        });

        socket.on('new-sos', (sosData) => {
            alert(`!!! SOS ALERT !!!\nFrom: ${sosData.name}\nMessage: ${sosData.message}`);
        });

        return () => {
            socket.off('new-report');
            socket.off('new-sos');
        };
    }, []);

    return (
        <Layout>
            <div className={styles.dashboardGrid}>
                <div className={styles.mapArea}>
                    <MapComponent reports={reports} resources={resources} />
                </div>
                <div className={styles.sidebarArea}>
                    {loading ? <p>Loading feed...</p> : <LiveFeed reports={reports} />}
                </div>
            </div>
        </Layout>
    );
};

export default DashboardPage;