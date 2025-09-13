import React from "react";
import { useParams } from "react-router-dom";
import data from "../../assets/test_data.json";

const Relief = () => {
  const { reliefId } = useParams();

  // Find the relief by ID
  const reliefEventData = data.relief_data.find(
    (event) => event.id === parseInt(reliefId)
  );

  // Find related org & disaster
  const orgData = reliefEventData
    ? data.orgs.find((org) => org.id === reliefEventData.org_id)
    : null;

  const disasterData = reliefEventData
    ? data.disasters.find((dis) => dis.id === reliefEventData.disaster_id)
    : null;

  // Find related fundraisers
  const fundraisers = reliefEventData
    ? data.fundraisers.filter((f) => f.relief_id === reliefEventData.id)
    : [];

  return (
    <div className="text-gray-800 max-w-3xl mx-auto p-4">
      {reliefEventData ? (
        <>
          {/* Title + Image */}
          <h1 className="text-2xl font-bold mb-2">{reliefEventData.name}</h1>
          <img
            src={reliefEventData.image}
            alt={reliefEventData.name}
            className="w-full max-w-md rounded-lg shadow-md mb-4"
          />

          {/* Description */}
          <p className="mb-4">{reliefEventData.description}</p>

          {/* Organizer */}
          {orgData && (
            <p className="mb-2">
              <span className="font-semibold">Organized by:</span>{" "}
              {orgData.name}
            </p>
          )}

          {/* Disaster link */}
          {disasterData && (
            <p className="mb-4 text-sm text-gray-600">
              <span className="font-semibold">Disaster:</span>{" "}
              {disasterData.name} ({disasterData.location})
            </p>
          )}

          {/* Fund progress */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-2">Funds Raised</h2>
            <p className="mb-1">
              <span className="font-semibold">Raised:</span> $
              {reliefEventData.raised.toLocaleString()}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Goal:</span> $
              {reliefEventData.goal.toLocaleString()}
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{
                  width: `${Math.min(
                    (reliefEventData.raised / reliefEventData.goal) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Budget Allocation */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Budget Allocation</h2>
            <ul className="space-y-1">
              {Object.entries(reliefEventData.budget_allocation).map(
                ([key, value]) => (
                  <li key={key} className="flex justify-between">
                    <span>{key.replace(/_/g, " ")}:</span>
                    <span>${value.toLocaleString()}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contributions */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Contributions</h2>
            <ul className="list-disc pl-5 space-y-1">
              {reliefEventData.contributions.map((c) => (
                <li key={c.cont_id}>
                  <span className="font-semibold">{c.name}:</span> {c.desc}
                </li>
              ))}
            </ul>
          </div>

          {/* Related Fundraisers */}
          {fundraisers.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">
                Fundraisers Supporting This Relief
              </h2>
              <ul className="space-y-2">
                {fundraisers.map((f) => (
                  <li
                    key={f.id}
                    className="p-3 bg-white border rounded-lg shadow-sm"
                  >
                    <p className="font-semibold">{f.name}</p>
                    <p className="text-sm text-gray-600">{f.desc}</p>
                    <p className="text-sm mt-1">
                      Raised ${f.raised.toLocaleString()} / $
                      {f.goal.toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="text-red-600">Relief event not found.</p>
      )}
    </div>
  );
};

export default Relief;
