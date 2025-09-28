// src/components/LocationPicker.jsx
import {
  MapContainer,
  TileLayer,
  Marker,
  GeoJSON,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useMemo, useState } from "react";

import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import bbox from "@turf/bbox";
import { point as turfPoint } from "@turf/helpers";

import myanmarGeo from "../assets/myanmar_geo.json"; // adjust path as needed

function FitToMyanmar({ feature }) {
  const map = useMap();
  useEffect(() => {
    if (!feature) return;
    const [minX, minY, maxX, maxY] = bbox(feature);
    const bounds = [
      [minY, minX],
      [maxY, maxX],
    ];
    map.setMaxBounds(bounds);
    // map.fitBounds(bounds, { padding: [25, 25], maxZoom: 7 });
  }, [feature, map]);
  return null;
}

export default function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(""); // validation message
  const [outlineColor, setOutlineColor] = useState("#699ECC"); // default primary

  // Normalize incoming GeoJSON to a single Feature
  const mmFeature = useMemo(() => {
    if (!myanmarGeo) return null;
    if (myanmarGeo.type === "FeatureCollection") {
      return myanmarGeo.features?.[0] ?? null;
    }
    if (myanmarGeo.type === "Feature") return myanmarGeo;
    return { type: "Feature", properties: {}, geometry: myanmarGeo };
  }, []);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        if (!mmFeature) return;
        const pt = turfPoint([e.latlng.lng, e.latlng.lat]);
        const inside = booleanPointInPolygon(pt, mmFeature);

        if (!inside) {
          setError("Please select a location inside Myanmar.");
          setOutlineColor("#203E5B"); // accent
          return;
        }

        setError("");
        setOutlineColor("#699ECC"); // back to primary
        setPosition(e.latlng);
        onLocationSelect?.(e.latlng);
      },
    });
    return position ? <Marker position={position} /> : null;
  };

  return (
    <div className="space-y-2">
      <div className="w-full h-48 sm:h-64 lg:h-80 rounded-xl overflow-hidden shadow-md border border-gray-200">
        <MapContainer
          center={[21.9162, 95.956]}
          zoom={5}
          scrollWheelZoom
          className="w-full h-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {mmFeature && (
            <>
              <GeoJSON
                data={mmFeature}
                style={() => ({
                  color: outlineColor,
                  weight: 2,
                  fillColor: "#C1E3EE",
                  fillOpacity: 0.0,
                })}
              />
              {/* <FitToMyanmar feature={mmFeature} /> */}
            </>
          )}
          <LocationMarker />
        </MapContainer>
      </div>

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}
