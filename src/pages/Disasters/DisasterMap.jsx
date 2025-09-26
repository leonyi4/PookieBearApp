// src/pages/Disasters/DisasterMap.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./DisasterMap.css";
import { supabase } from "../../lib/supabase-client";
import { Link } from "react-router-dom";
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
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [25, 25] });
      map.setMaxBounds(bounds);
    }
  }, [map, bounds]);
  return null;
};

const DisasterMap = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const myanmarBounds = [
    [9.5, 92.0], // SW
    [28.5, 101.0], // NE
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: disastersData, error: disastersError } = await supabase
          .from("disasters")
          .select("*");

        if (disastersError) throw disastersError;

        const enrichedDisasters = await Promise.all(
          disastersData.map(async (disaster) => {
            // donations
            const { data: donationLinks } = await supabase
              .from("disaster_donations")
              .select("donation_id")
              .eq("disaster_id", disaster.id);

            let donations = [];
            if (donationLinks?.length) {
              const donationIds = donationLinks.map((d) => d.donation_id);
              const { data: donationData } = await supabase
                .from("donations")
                .select("*")
                .in("id", donationIds);
              donations = donationData || [];
            }

            // volunteers
            const { data: volunteerLinks } = await supabase
              .from("disaster_volunteers")
              .select("volunteers_id")
              .eq("disaster_id", disaster.id);

            let volunteers = [];
            if (volunteerLinks?.length) {
              const volunteerIds = volunteerLinks.map((v) => v.volunteers_id);
              const { data: volunteerData } = await supabase
                .from("volunteers")
                .select("*")
                .in("id", volunteerIds);
              volunteers = volunteerData || [];
            }

            return { ...disaster, donations, volunteers };
          })
        );

        setDisasters(enrichedDisasters);
      } catch (err) {
        console.error("Error fetching disasters:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarkerClick = (marker) => {
    if (selectedMarker && selectedMarker.id === marker.id) {
      setSelectedMarker(null);
    } else {
      setSelectedMarker(marker);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching Disaster Map..." />;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="relative h-fullbg-background">
      <h1 className="text-primary text-xl uppercase my-2 font-bold text-center">
        Disaster Map of Myanmar
      </h1>

      {/* Map Section */}
      <MapContainer
        className="h-[600px]  w-full rounded-xl overflow-hidden shadow-md border-2 border-slate-300"
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
            eventHandlers={{ click: () => handleMarkerClick(marker) }}
          />
        ))}
        <FitMyanmarBounds bounds={myanmarBounds} />
      </MapContainer>

      {/* Bottom Overlay Info */}
      {selectedMarker && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-white p-3 
          shadow-md max-h-[60%] overflow-y-auto rounded-2xl z-1000"
        >
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
