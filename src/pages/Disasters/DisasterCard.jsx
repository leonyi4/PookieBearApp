import React from "react";
import { Link } from "react-router-dom";

const DisasterCard = ({ disaster }) => {
  return (
    <div className="bg-blue-100 rounded-xl shadow-lg overflow-hidden">
      <div className="flex">
        {/* Image */}
        {disaster.image && (
          <img
            src={disaster.image}
            alt={disaster.name}
            className="w-28 h-fill object-cover"
          />
        )}

        {/* Text content */}
        <div className="flex-1 p-3">
          <h2 className="font-bold text-gray-900 text-md uppercase">
            {disaster.name}
          </h2>
          <div className="flex justify-between items-center ">
            <p className="text-gray-500 text-xs mt-1">
              Date: {new Date(disaster.date).toLocaleDateString()}
            </p>
            <p className="mt-1 text-sm text-primary font-bold ">
              Severity:{" "}
              {disaster.severity === "High" ? (
                <span className="text-red-600 font-semibold"> High</span>
              ) : disaster.severity === "Medium" ? (
                <span className="text-yellow-600 font-semibold"> Medium</span>
              ) : (
                <span className="text-green-600 font-semibold"> Low</span>
              )}
            </p>
          </div>
          <p className="text-gray-700 text-sm line-clamp-3">
            {disaster.description}
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="px-3 pb-3 mt-2">
        <Link to={`/DisasterMap/${disaster.id}`}>
          <button className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-secondary transition">
            View Events
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DisasterCard;
