import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// This is a common fix for a bug with react-leaflet's default icon.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


const MapComponent = ({ reports }) => {
  const position = [23.2156, 72.6369]; // Default: Gandhinagar, India

  return (
    <MapContainer center={position} zoom={10} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {reports.map((report) => (
        <Marker
          key={report._id}
          position={[report.location.coordinates[1], report.location.coordinates[0]]}
        >
          <Popup>
            <b>Status: {report.status}</b><br />
            {report.text}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;