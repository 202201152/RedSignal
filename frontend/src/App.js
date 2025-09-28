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

    // -- NEWLY ADDED LOGIC --
    // Get the user's current location and tell the server to join the corresponding room.
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Joining room for location: ${latitude}, ${longitude}`);
        // Emit an event to the server to join the room
        socket.emit('join_location_room', { lat: latitude, lng: longitude });
      },
      (error) => {
        // Handle cases where the user denies location access
        console.error("Could not get user location for joining room.", error);
      }
    );
    // -- END OF NEWLY ADDED LOGIC --

    // Listen for new reports from WebSocket
    socket.on('new-report', (newReport) => {
      console.log('Received new report via WebSocket:', newReport);
      setReports(prevReports => [newReport, ...prevReports]);
    });

    // Listen for new SOS alerts from WebSocket
    socket.on('new-sos', (sosData) => {
      console.log('Received SOS:', sosData);
      // Display a simple browser alert for the SOS
      alert(`!!! SOS ALERT !!!\nFrom: ${sosData.name}\nMessage: ${sosData.message}`);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('new-report');
      socket.off('new-sos');
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