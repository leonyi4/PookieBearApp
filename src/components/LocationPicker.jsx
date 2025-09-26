import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onLocationSelect(e.latlng);
      },
    });
    return position ? <Marker position={position} /> : null;
  };

  return (
    <div className="w-full h-48 sm:h-64 lg:h-80 rounded-xl overflow-hidden shadow-md border border-gray-200">
      <MapContainer
        center={[21.9162, 95.956]}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
