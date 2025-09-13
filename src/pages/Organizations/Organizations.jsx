import React from "react";
import { Link } from "react-router-dom";
import data from "../../assets/test_data.json";

const Organizations = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 bg-background min-h-screen">
      <h1 className="text-2xl font-bold text-accent mb-6">
        Partner Organizations
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.orgs.map((org) => (
          <Link
            key={org.id}
            to={`/organizations/${org.id}`}
            className="bg-white border border-secondary rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col"
          >
            <img
              src={org.image}
              alt={org.name}
              className="h-40 w-full object-cover rounded-t-xl"
            />
            <div className="p-4 flex-1 flex flex-col">
              <h2 className="text-lg font-semibold text-accent mb-2">
                {org.name}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                {org.desc}
              </p>
              <div className="mt-auto flex items-center justify-between text-sm">
                <span className="text-primary font-medium">
                  {org.ongoing.length} Ongoing Reliefs
                </span>
                <span className="text-gray-500">
                  ⭐ {org.ratings.public_rating.toFixed(1)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Organizations;
