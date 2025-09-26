// src/components/AidRequestCard.jsx
import { Link } from "react-router-dom";

export default function AidRequestCard({ request }) {
  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <h3 className="font-bold text-primary">{request.type}</h3>
      <p className="text-sm text-gray-600">
        Severity: <span className="font-medium">{request.severity}</span>
      </p>
      <p className="text-sm text-gray-700 mt-1">{request.needs}</p>
      <p className="text-xs text-gray-500 mt-2">
        Location: {request.location}
      </p>
      <Link
        to={`/aid-requests/${request.id}`}
        className="block mt-3 text-primary font-semibold text-sm"
      >
        View Details →
      </Link>
    </div>
  );
}
