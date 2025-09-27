import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import data from "../../assets/test_data.json";

// Fix Leaflet marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const MiniMap = () => {
  const navigate = useNavigate();

  const handleMarkerClick = () => {
    navigate("/DisasterMap");
  };

  const markers = data.disasters;
  const central_myanmar = [21.9162, 95.956];

  return (
    <div className="relative w-full h-52 sm:h-64 md:h-80 rounded-xl shadow-md overflow-hidden cursor-pointer border border-primary">
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
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[
              marker.location_data.latitude,
              marker.location_data.longitude,
            ]}
            eventHandlers={{ click: handleMarkerClick }}
          />
        ))}
      </MapContainer>

      {/* Overlay Label */}
      <div className="absolute bottom-3 right-3 bg-primary text-white px-3 py-1 rounded-lg text-xs sm:text-sm shadow-md">
        View Full Map
      </div>
    </div>
  );
};

export default MiniMap;
