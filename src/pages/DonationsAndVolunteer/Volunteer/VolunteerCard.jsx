import React from "react";
import { Link } from "react-router-dom";
import data from "../../../assets/test_data.json";

const VolunteerCard = ({ data: vol, home, className = "" }) => {
  const progress =
    (vol.impact.volunteers_signed_up / vol.impact.volunteers_needed) * 100;
  const org_data = data.orgs.find((o) => o.id === vol.org_id);

  return (
    <div
      className={`bg-secondary border rounded-xl shadow-md hover:shadow-lg transition flex flex-col ${className}`}
    >
      {/* Image */}
      <img
        src={vol.image}
        alt={vol.name}
        className="w-full h-36 sm:h-44 lg:h-56 object-cover rounded-t-xl"
      />

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
          {vol.name}
        </h2>

        {/* Progress */}
        <div className="mt-auto">
          <p className="text-xs sm:text-sm text-gray-700">
            {vol.impact.volunteers_signed_up} signed up of{" "}
            {vol.impact.volunteers_needed}
          </p>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
            <div
              className="h-2 bg-primary rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Goal: {vol.impact.volunteers_needed} volunteers
          </p>
        </div>

        {/* Org */}
        {org_data && (
          <div className="flex items-center mt-2">
            <img
              src={org_data.logo}
              alt={org_data.name}
              className="h-8 w-8 rounded-full mr-2"
            />
            <span className="text-sm font-medium">{org_data.name}</span>
          </div>
        )}

        {/* Buttons */}
        {!home && (
          <div className="mt-3 flex gap-2">
            <Link
              to={`/DonationsAndVolunteers/volunteers/${vol.id}`}
              className="w-1/2"
            >
              <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-accent">
                View Details
              </button>
            </Link>
            <button className="w-1/2 bg-accent text-white py-2 rounded-lg hover:bg-gray-500">
              Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerCard;
