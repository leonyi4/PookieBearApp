import React from "react";
import { Link } from "react-router-dom";
import data from "../../assets/test_data.json";

const Donations = () => {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Ongoing Relief Campaigns
      </h1>

      {data.relief_data.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.relief_data.map((relief) => (
            <Link
              key={relief.id}
              to={`/donations/${relief.id}`}
              className="bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col"
            >
              {/* Image */}
              <img
                src={relief.image}
                alt={relief.name}
                className="h-40 w-full object-cover rounded-t-lg"
              />

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {relief.name}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                  {relief.description}
                </p>

                {/* Progress bar */}
                <div className="mt-auto">
                  <p className="text-sm text-gray-700">
                    Raised ${relief.raised.toLocaleString()} of $
                    {relief.goal.toLocaleString()}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (relief.raised / relief.goal) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No relief campaigns found.</p>
      )}
    </div>
  );
};

export default Donations;
