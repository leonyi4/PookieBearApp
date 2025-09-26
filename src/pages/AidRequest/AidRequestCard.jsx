// src/components/AidRequestCard.jsx
import React from "react";
import LocationMap from "../../components/LocationMap"

export default function AidRequestCard({ request }) {
  // Fallback status if not provided
  const status = request.status || "Pending";

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Fulfilled: "bg-green-100 text-green-700",
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow hover:shadow-md transition space-y-3">
      {/* Emergency Type & Severity */}
      <div className="flex items-center justify-between">
        <p className="font-semibold text-primary uppercase">
          {request.disaster_type}
        </p>
        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 font-medium">
          {request.severity}
        </span>
      </div>

      {/* Aid Types */}
      <div>
        <p className="text-sm font-medium text-gray-700">Requested Aid:</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {Array.isArray(request.aid_types) ? (
            request.aid_types.map((aid, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs rounded-lg bg-primary/10 text-primary font-medium"
              >
                {aid}
              </span>
            ))
          ) : (
            <span className="px-2 py-1 text-xs rounded-lg bg-primary/10 text-primary font-medium">
              {request.aid_types}
            </span>
          )}
        </div>
      </div>

      {/* Location Preview */}
      {request.latitude && request.longitude && (
        <div className="h-32 w-full rounded-md overflow-hidden">
          <LocationMap
            position={[request.latitude, request.longitude]}
            label={request.city || request.type_of_emergency}
          />
        </div>
      )}

      {/* Status & Metadata */}
      <div className="flex items-center justify-between text-xs">
        <span
          className={`px-2 py-1 rounded-full font-medium ${
            statusColors[status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </span>
        <span className="text-gray-400">
          {new Date(request.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
