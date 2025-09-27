import React from "react";
import LocationMap from "../../components/LocationMap";
import { Link } from "react-router-dom";

export default function AidRequestCard({ request }) {
  const status = request.status || "Pending";
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Fulfilled: "bg-green-100 text-green-700",
  };
  const org = request.organizations;

  return (
    <div className="p-4 border rounded-xl bg-background shadow hover:shadow-md transition flex flex-col gap-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="font-semibold text-primary uppercase text-sm sm:text-base">
          {request.disaster_type}
        </p>
        <span className="px-2 py-1 text-xs sm:text-sm rounded-full bg-red-100 text-red-700 font-medium">
          {request.severity}
        </span>
      </div>

      {/* Aid Types */}
      <div>
        <p className="text-sm font-medium text-accent">Requested Aid:</p>
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

      {/* Location */}
      {request.latitude && request.longitude && (
        <LocationMap
          position={[request.latitude, request.longitude]}
          label={request.city || request.disaster_type}
          className="z-0"
        />
      )}

      {/* Footer Info */}
      <div className="space-y-2 text-xs sm:text-sm">
        <div className="flex justify-between items-center">
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

        {/* Assigned Org */}
        {org && (
          <Link
            to={`/OrgsAndSponsors/organizations/${org.id}`}
            className="flex items-center gap-2 text-accent hover:text-primary transition"
          >
            <span>
              <span className="font-medium">Assigned:</span> {org.name}
            </span>
            {org.logo && (
              <img
                src={org.logo}
                alt={org.name}
                className="w-6 h-6 rounded-full border"
              />
            )}
          </Link>
        )}

        {/* ETA */}
        {request.eta && (
          <p className="text-gray-700">
            <span className="font-medium">ETA:</span>{" "}
            {new Date(request.eta).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
