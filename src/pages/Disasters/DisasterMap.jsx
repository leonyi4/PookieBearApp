import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./DisasterMap.css";
import data from "../../assets/test_data.json";

// Fix Leaflet marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Link } from "react-router-dom";

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

  // Sample disaster markers data
  // In real app, fetch this data from an API
  const markers = data.disasters;
  console.log(markers);



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
    <div className='relative h-full p-4 bg-background'>
      <h1 className=' text-primary text-xl uppercase my-2 font-bold text-center'>Disaster Map of Myanmar</h1>
      {/* Map Section */}
      <MapContainer
        className="h-[600px] w-full rounded-xl overflow-hidden shadow-md border-2 border-slate-300 
        transition-transform duration-300 ease-in z-0 hover:scale-[1.04] hover:shadow-lg" 
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
            position={[
              marker.location_data.latitude,
              marker.location_data.longitude,
            ]}
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

          className="absolute bottom-0 left-0 right-0 bg-background p-4 
          shadow-sm max-h-[40%] overflow-y-auto transition-transform duration-300 ease-in-out rounded-t-xl z-10"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-primary">
              {selectedMarker.name}
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
            className="w-full h-40 shadow-sm rounded-lg"
          />
          <div className="flex">
            <Link to={`/DisasterMap/${selectedMarker.id}`}>
              <button className="bg-accent text-background py-2 px-4 rounded">
                View Details
              </button>
            </Link>
            <button className="ml-4 bg-secondary text-accent py-2 px-4 rounded">
              Donate Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisasterMap;
