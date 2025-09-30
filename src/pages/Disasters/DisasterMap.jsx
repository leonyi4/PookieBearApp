import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./DisasterMap.css";
import { fetchDisastersWithRelations } from "../../lib/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import DisasterCard from "./DisasterCard";

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
  useState(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [25, 25] });
      map.setMaxBounds(bounds);
    }
  }, []); // ✅ run only once
  return null;
};

const DisasterMap = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);

  const myanmarBounds = [
    [9.5, 92.0], // SW
    [28.5, 101.0], // NE
  ];

  const {
    data: disasters,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["disastersWithRelations"],
    queryFn: fetchDisastersWithRelations,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen text-primary">
        <LoadingSpinner message="Fetching Disaster Map..." />
      </div>
    );
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="relative h-full bg-background">
      <h1 className="text-primary text-xl sm:text-2xl uppercase my-2 font-bold text-center">
        Disaster Map of Myanmar
      </h1>

      {/* Map Section */}
      <MapContainer
        className="h-[600px] lg:h-[800px] w-full rounded-xl overflow-hidden shadow-md border-2 border-slate-300"
        center={[20.0, 96.0]}
        zoom={6}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {disasters.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}
            eventHandlers={{ click: () => setSelectedMarker(marker) }}
          />
        ))}
        <FitMyanmarBounds bounds={myanmarBounds} />
      </MapContainer>

      {/* Bottom Overlay Info */}
      {selectedMarker && (
        <div className="absolute bottom-0 left-0 right-0 bg-white p-3 shadow-md max-h-[65%] sm:max-h-[50%] md:max-h-[70%] overflow-y-auto rounded-2xl z-1000">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-primary">
              {selectedMarker.name}
            </h2>
            <button
              onClick={() => setSelectedMarker(null)}
              className="text-gray-600 text-xl font-bold"
            >
              ✕
            </button>
          </div>
          <DisasterCard disaster={selectedMarker} />
        </div>
      )}
    </div>
  );
};

export default DisasterMap;
