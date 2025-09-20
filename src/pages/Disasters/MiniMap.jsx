import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import data from "../../assets/test_data.json";

const MiniMap = () => {
  const navigate = useNavigate();

  const handleMarkerClick = () => {
    navigate("/DisasterMap"); // Navigate to full map page
  };

  // load data
  const markers = data.disasters;
  const central_myanmar = [21.9162, 95.956]

  return (
    <div
      className="relative w-full h-64 rounded-xl shadow-md overflow-hidden cursor-pointer border border-primary"
    >
      <MapContainer
        center={central_myanmar}
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
        />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.location_data.latitude, marker.location_data.longitude]}
            eventHandlers={{
              click: handleMarkerClick,
            }}
          />
        ))}
      </MapContainer>

      {/* Overlay Label */}
      <div className=" bottom-3 right-3 bg-primary text-white px-3 py-1 rounded-lg text-sm shadow-md">
        View Full Map
      </div>
    </div>
  );
};

export default MiniMap;
