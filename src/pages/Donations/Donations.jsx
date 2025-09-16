import React from "react";
import { Link } from "react-router-dom";
import data from "../../assets/test_data.json";

const Donations = () => {
  const relief_data = data.relief_data;

  // Get org data for each relief campaign

  const org_data = {};
  for (let relief of relief_data) {
    const org = relief["org_id"];
    if (!org_data[org]) {
      org_data[org] = data.orgs.find((o) => o.id === org);
    }
  }

  relief_data.map((r) => {
    var current_org = org_data[r.org_id];
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Ongoing Relief Campaigns
      </h1>

      {relief_data.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relief_data.map((relief) => (
            <div
              key={relief.id}
              className="bg-secondary border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col"
            >
              {/* Content */}
              <div className="p-2 flex-1 flex flex-col ">
                {/* Image */}
                <img
                  src={relief.image}
                  alt={relief.name}
                  className="h-40 w-full object-cover rounded-t-lg"
                />
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {relief.name}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3 mb-1">
                  {relief.description}
                </p>

                {/* Progress bar */}
                <div className="mt-auto ">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-black">Raised</p>
                    <p className="text-sm text-gray-700">
                      {" "}
                      {Math.round(
                        (relief.raised / relief.goal) * 100
                      ).toLocaleString()}{" "}
                      %
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (relief.raised / relief.goal) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Goal: ${relief.goal.toLocaleString()}
                  </p>
                </div>

                {/* Organization Info */}
                <div className="flex items-center mb-1 ">
                  <img
                    src={org_data[relief.org_id].logo}
                    alt={org_data[relief.org_id].name}
                    className="h-8 w-8 rounded-full mr-2"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {org_data[relief.org_id].name}
                  </span>
                </div>

                {/* View Details and Share buttons */}
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
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No relief campaigns found.</p>
      )}
    </div>
  );
};

export default Donations;
