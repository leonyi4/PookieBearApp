import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";



const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);

  // Needs permission
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         const userLocation = { lat: latitude, lng: longitude };
//         setPosition(userLocation);
//         onLocationSelect(userLocation); // preset selection
//       },
//       (err) => {
//         console.error("Geolocation error:", err);
//         // fallback to Myanmar center
//         setPosition({ lat: 21.9162, lng: 95.9560 });
//       }
//     );
//   }, []);


  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onLocationSelect(e.latlng); // send back to parent
      },
    });

    return position ? <Marker position={position} /> : null;
  };

  const myanmarBounds = [
    [9.5, 92.0], // SW
    [28.5, 101.0], // NE
  ];

  return (
    <MapContainer
      center={[21.9162, 95.9560]}
      zoom={5}
      scrollWheelZoom={true}
      className="rounded-lg shadow-md h-[200px] w-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
};

export default LocationPicker;
