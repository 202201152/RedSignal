// frontend/src/components/MapComponent.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { resourceIcon } from '../utils/mapIcons.js';

// Default Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ reports, resources }) => {
  const position = [23.2156, 72.6369];

  return (
    <MapContainer center={position} zoom={10} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />

      <LayersControl position="topright">
        <LayersControl.Overlay checked name="Disaster Reports">
          <MarkerClusterGroup>
            {reports.map((report) => (
              <Marker key={`report-${report._id}`} position={[report.location.coordinates[1], report.location.coordinates[0]]}>
                <Popup><b>Report: {report.status}</b><br />{report.text}</Popup>
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
  );
};

export default MapComponent;