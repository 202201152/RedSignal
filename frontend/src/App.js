import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import ReportForm from './components/ReportForm';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Fetch initial reports
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reports');
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Failed to fetch initial reports:", error);
      }
    };
    fetchReports();

    // Listen for new reports from WebSocket
    socket.on('new-report', (newReport) => {
      console.log('Received new report via WebSocket:', newReport);
      setReports(prevReports => [newReport, ...prevReports]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('new-report');
    };
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>Disaster Alert Platform (Test UI)</h1>
      </header>
      <main>
        <div className="map-container">
          <MapComponent reports={reports} />
        </div>
        <div className="form-container">
          <h2>Submit a Report</h2>
          <ReportForm />
        </div>
      </main>
    </div>
  );
}

export default App;