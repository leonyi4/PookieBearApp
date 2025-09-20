import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// Marker positions (same as your DisasterMap)
const markers = [
  { id: 1, position: [16.8409, 96.1735], title: "Yangon Fire" },
  { id: 2, position: [16.7833, 94.8], title: "Ayeyarwady Flood" },
  { id: 3, position: [21.9162, 95.956], title: "Mandalay Incident" },
];

const MiniMap = () => {
  const navigate = useNavigate();

  const handleMarkerClick = () => {
    navigate("/DisasterMap"); // Navigate to full map page
  };

  return (
    <div
      className="relative w-full h-64 rounded-xl shadow-md overflow-hidden cursor-pointer border border-primary"
    >
      <MapContainer
        center={[21.9162, 95.956]} // Center Myanmar
        zoom={5}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=""
        />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            eventHandlers={{
              click: handleMarkerClick,
            }}
          />
        ))}
      </MapContainer>

      {/* Overlay Label */}
      <div className="absolute bottom-3 right-3 bg-primary text-white px-3 py-1 rounded-lg text-sm shadow-md">
        View Full Map
      </div>
    </div>
  );
};

export default MiniMap;
