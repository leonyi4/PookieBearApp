import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function LocationMap({ position, label }) {
  if (!position || position.length !== 2) return null;

  return (
    <div className="w-full h-40 sm:h-56 lg:h-72 rounded-xl overflow-hidden shadow-md border border-gray-200">
      <MapContainer
        center={position}
        zoom={10}
        className="w-full h-full"
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>{label && <Popup>{label}</Popup>}</Marker>
      </MapContainer>
    </div>
  );
}
