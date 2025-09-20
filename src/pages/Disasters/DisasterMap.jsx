import React, { useEffect } from 'react';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "./DisasterMap.css"; 

// Component to auto-fit map bounds but respect maxBounds
const FitBounds = ({ markers, maxBounds }) => {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = markers.map(m => m.position);
      map.fitBounds(bounds, { padding: [50, 50] });

      // Ensure the map does not go outside Myanmar
      if (maxBounds) {
        map.setMaxBounds(maxBounds);
      }
    }
  }, [map, markers, maxBounds]);
  return null;
};

const DisasterMap = () => {
  // Myanmar disaster markers
  const markers = [
    { position: [16.8409, 96.1735], popupText: "Yangon Fire" },
    { position: [16.7833, 94.8000], popupText: "Ayeyarwady Flood" },
    { position: [21.9162, 95.9560], popupText: "Mandalay Incident" }
  ];

  // Myanmar bounding box: SW and NE corners
  const myanmarBounds = [[9.5, 92.0], [28.5, 101.0]];

  return (
    <MapContainer
      center={[20.0, 96.0]} // rough center of Myanmar
      zoom={6}
      className="disaster-map-container"
      maxBounds={myanmarBounds}          // restrict map to Myanmar
      maxBoundsViscosity={1.0}           // prevents dragging outside
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          <Popup>{marker.popupText}</Popup>
        </Marker>
      ))}
      <FitBounds markers={markers} maxBounds={myanmarBounds} />
    </MapContainer>
  );
};

export default DisasterMap;
