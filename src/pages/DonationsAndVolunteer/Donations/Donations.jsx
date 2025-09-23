import React from "react";
import { Link } from "react-router-dom";
import data from "../../../assets/test_data.json";

const Donations = () => {
  // Sort donations by ascending ID
  const donations = [...data.donations].sort((a, b) => a.id - b.id);

  // Build org lookup map
  const org_data = donations.reduce((acc, relief) => {
    const org = relief.org_id;
    if (!acc[org]) {
      const found = data.orgs.find((o) => o.id === org);
      if (found) acc[org] = found;
    }
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Ongoing Relief Campaigns
      </h1>

      {donations.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {donations.map((relief) => {
            const org = org_data[relief.org_id];
            const progress = relief.goal > 0
              ? Math.min((relief.raised / relief.goal) * 100, 100)
              : 0;

            return (
              <div
                key={relief.id}
                className="bg-secondary border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col"
              >
                <div className="p-2 flex-1 flex flex-col">
                  {/* Image */}
                  {relief.image && (
                    <img
                      src={relief.image}
                      alt={relief.name}
                      className="h-40 w-full object-cover rounded-t-lg"
                    />
                  )}

                  {/* Title & Description */}
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {relief.name}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-1">
                    {relief.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-auto">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-black">Raised</p>
                      <p className="text-sm text-gray-700">
                        {Math.round(progress).toLocaleString()}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-700">
                      Goal: ${relief.goal.toLocaleString()}
                    </p>
                  </div>

                  {/* Organization Info */}
                  {org && (
                    <div className="flex items-center mb-1 mt-2">
                      <img
                        src={org.logo}
                        alt={org.name}
                        className="h-8 w-8 rounded-full mr-2"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        {org.name}
                      </span>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="mt-2">
                    <Link to={`/donations/${relief.id}`}>
                      <button className="w-full bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-accent">
                        View Details
                      </button>
                    </Link>
                    <button className="mt-1 w-full bg-accent text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-400">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No relief campaigns found.</p>
      )}
    </div>
  );
};

export default Donations;
