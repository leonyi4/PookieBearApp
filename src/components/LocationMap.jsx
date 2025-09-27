import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

export default function LocationMap({ position, label, disaster_id }) {
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
        <Marker position={position}>
          {label && (
            <Popup
              autoPan={true}
              autoPanPadding={[40, 20]} // gives extra space around popup
              maxWidth={200} // prevents text stretching popup too wide
              className="custom-leaflet-popup"
            >
              <Link to={`/DisasterMap/${disaster_id}`}>
                <button className="px-3 py-1 text-md sm:text-sm text-white font-medium rounded-md ">
                  View Disaster Details
                </button>
              </Link>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
}
