import React from "react";
import { Link } from "react-router-dom";
import data from "../../../assets/test_data.json";

const DonationCard = ({ data: donation, home: isHome, className = "" }) => {
  const progress = (donation.raised / donation.goal) * 100;

  // find org for the donation
  const org_id = donation.org_id;
  const org_data = data.orgs.find((o) => o.id === org_id);

  return (
    <div
      key={donation.id}
      className={`bg-secondary border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col flex-shrink-0 ${className}`}
    >
      {/* Content */}
      <div className="p-2 flex-1 flex flex-col">
        {/* Image */}
        <img
          src={donation.image}
          alt={donation.name}
          className="h-40 w-full object-cover rounded-t-lg"
        />

        {/* Title + Description */}
        <h2 className="text-lg font-semibold text-gray-900 mb-1 mt-2">
          {donation.name}
        </h2>
        {!isHome && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {donation.description}
          </p>
        )}

        {/* Progress bar */}
        <div className="mt-auto">
          <div className="flex justify-between items-center">
            <p className="text-sm text-black">Raised</p>
            <p className="text-sm text-gray-700">
              {Math.round(progress).toLocaleString()} %
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-700">
            Goal: ${donation.goal.toLocaleString()}
          </p>
        </div>

        {/* Organization Info */}
        {org_data && (
          <div className="flex items-center mt-2 mb-1">
            <img
              src={org_data.logo}
              alt={org_data.name}
              className="h-8 w-8 rounded-full mr-2"
            />
            <span className="text-sm font-medium text-gray-800">
              {org_data.name}
            </span>
          </div>
        )}

        {/* Buttons */}
        {!isHome && (
          <div className="mt-2 flex space-x-2 justify-between text-center">
            <Link
              to={`DonationsAndVolunteers/donations/${donation.id}`}
              className="w-full bg-primary  text-white font-medium py-1 px-1 rounded-md hover:bg-accentS"
            >
              <button className="">View Details</button>
            </Link>
            <button className="w-full bg-accent text-white font-medium py-1 px-1 rounded-md hover:bg-gray-400">
              Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationCard;
