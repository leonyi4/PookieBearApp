import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./DisasterMap.css";

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

// Auto-fit Myanmar bounds
const FitMyanmarBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [30, 30] });
      map.setMaxBounds(bounds);
    }
  }, [map, bounds]);
  return null;
};

const DisasterMap = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);

  const markers = [
    {
      id: 1,
      position: [16.8409, 96.1735],
      title: "Yangon Fire",
      description: "A large fire outbreak reported in downtown Yangon.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/6/6b/Fire_example.jpg",
    },
    {
      id: 2,
      position: [16.7833, 94.8],
      title: "Ayeyarwady Flood",
      description:
        "Heavy flooding affecting several villages in the Ayeyarwady delta.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/6/65/Flood_example.jpg",
    },
    {
      id: 3,
      position: [21.9162, 95.956],
      title: "Mandalay Incident",
      description: "Reported building collapse in Mandalay city.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/d/d1/Building_collapse_example.jpg",
    },
  ];

  const myanmarBounds = [
    [9.5, 92.0], // SW
    [28.5, 101.0], // NE
  ];

  const handleMarkerClick = (marker) => {
    if (selectedMarker && selectedMarker.id === marker.id) {
      setSelectedMarker(null); // deselect if same marker is tapped
    } else {
      setSelectedMarker(marker);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Map Section */}
      <MapContainer
        className="disaster-map-container"
        center={[20.0, 96.0]}
        zoom={6}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            eventHandlers={{
              click: () => handleMarkerClick(marker),
            }}
          />
        ))}
        <FitMyanmarBounds bounds={myanmarBounds} />
      </MapContainer>

      {/* Bottom Chat-Box Style Info Panel */}
      {selectedMarker && (
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            background: "#fff",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            padding: "16px",
            boxShadow: "0 -4px 12px rgba(0,0,0,0.2)",
            maxHeight: "40%",
            overflowY: "auto",
            transition: "transform 0.3s ease",
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-blue-800">
              {selectedMarker.title}
            </h2>
            <button
              onClick={() => setSelectedMarker(null)}
              className="text-gray-600 text-sm"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-700 mb-2">{selectedMarker.description}</p>
          <img
            src={selectedMarker.image}
            alt={selectedMarker.title}
            style={{
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DisasterMap;
