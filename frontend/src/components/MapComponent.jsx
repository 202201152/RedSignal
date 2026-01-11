// frontend/src/components/MapComponent.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { resourceIcon } from '../utils/mapIcons.js';
import styles from './MapComponent.module.css';

// Default Icon Fix (keep just in case, though we are using divIcons mostly)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const createCustomIcon = (status) => {
  let className = 'marker-dot';

  if (status === 'verified') className += ' marker-verified';
  else if (status === 'pending') className += ' marker-warning';
  else if (status === 'critical') className += ' marker-critical'; // In case we add this later
  else className += ' marker-warning'; // Fallback

  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="${className}"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10], // Center it
    popupAnchor: [0, -10]
  });
};

const MapComponent = ({ reports, resources }) => {
  const position = [23.2156, 72.6369];

  // Calculate Stats
  const totalReports = reports.length;
  const verifiedReports = reports.filter(r => r.status === 'verified').length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;

  return (
    <div className={styles.mapContainer}>
      {/* Floating Stats Overlay */}
      <div className={styles.statsOverlay}>
        <h4 className={styles.statsTitle}>Live Situation</h4>
        <div className={styles.statItem}>
          <span>Total Reports</span>
          <span className={styles.statValue}>{totalReports}</span>
        </div>
        <div className={styles.statItem}>
          <span style={{ color: 'var(--color-success)' }}>Verified</span>
          <span className={styles.statValue}>{verifiedReports}</span>
        </div>
        <div className={styles.statItem}>
          <span style={{ color: 'var(--color-warning)' }}>Pending</span>
          <span className={styles.statValue}>{pendingReports}</span>
        </div>
      </div>

      <MapContainer center={position} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <LayersControl position="topright">
          <LayersControl.Overlay checked name="Disaster Reports">
            <MarkerClusterGroup>
              {reports.map((report) => (
                <Marker
                  key={`report-${report._id}`}
                  position={[report.location.coordinates[1], report.location.coordinates[0]]}
                  icon={createCustomIcon(report.status)}
                >
                  <Popup>
                    <strong>Status: {report.status}</strong>
                    <p>{report.text}</p>
                    <small>{new Date(report.createdAt).toLocaleString()}</small>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="NGO Resources">
            <MarkerClusterGroup>
              {resources && resources.map((resource) => (
                <Marker key={`resource-${resource._id}`} position={[resource.location.coordinates[1], resource.location.coordinates[0]]} icon={resourceIcon}>
                  <Popup><b>Resource: {resource.resourceType}</b><br />{resource.description}<br /><i>Quantity: {resource.quantity}</i></Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default MapComponent;