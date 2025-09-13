// src/pages/Organizations/OrgDetail.jsx
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import data from "../../assets/test_data.json";

export default function OrgDetail() {
  const { orgId } = useParams();

  // find org (case-sensitive key check)
  const orgsArray = data.orgs || data.Orgs || []; // tolerant to key name
  const reliefsArray = data.relief_data || data.reliefData || [];

  const orgData = orgsArray.find((o) => o.id === parseInt(orgId));

  // Helper: given an "ongoing" item (id | "123" | object), return the full relief object if possible
  const resolveRelief = (item) => {
    if (!item) return null;
    // numeric id
    if (typeof item === "number") {
      return reliefsArray.find((r) => r.id === item) || null;
    }
    // numeric string id
    if (typeof item === "string" && /^\d+$/.test(item)) {
      return reliefsArray.find((r) => r.id === parseInt(item)) || null;
    }
    // object: try to find canonical relief by id if provided, else assume it's already a partial object
    if (typeof item === "object") {
      if (item.id) {
        return reliefsArray.find((r) => r.id === item.id) || item;
      }
      return item;
    }
    return null;
  };

  // Normalize ongoing -> array of full relief objects (filter out nulls)
  const ongoingReliefs = useMemo(() => {
    if (!orgData?.ongoing) return [];
    return orgData.ongoing.map(resolveRelief).filter(Boolean);
  }, [orgData, reliefsArray]);

  if (!orgData) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-background min-h-screen">
        <p className="text-black">Organization not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-start space-x-6 mb-6">
        <img
          src={orgData.image}
          alt={orgData.name}
          className="w-32 h-32 object-cover rounded-lg shadow-md"
        />
        <div>
          <h1 className="text-2xl font-bold text-black mb-2">
            {orgData.name}
          </h1>
          <p className="text-black mb-3">{orgData.desc}</p>
          <div className="flex items-center space-x-4 text-sm text-black">
            <span>⭐ AI: {orgData.ratings?.ai_rating ?? "N/A"}</span>
            <span>⭐ Public: {orgData.ratings?.public_rating ?? "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Ongoing Reliefs */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-black mb-3">
          Ongoing Relief Campaigns
        </h2>

        {ongoingReliefs.length > 0 ? (
          <ul className="space-y-3">
            {ongoingReliefs.map((relief) => (
              <li
                key={relief.id}
                className="bg-white border border-secondary rounded-lg p-4 shadow-sm"
              >
                <h3 className="font-semibold text-black">{relief.name}</h3>
                {relief.desc && (
                  <p className="text-sm text-black mb-2">{relief.desc}</p>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    {typeof relief.raised !== "undefined" && typeof relief.goal !== "undefined" ? (
                      <p className="text-sm">
                        Raised ${relief.raised.toLocaleString()} / $
                        {relief.goal.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-sm text-black">No fund info</p>
                    )}
                  </div>

                  {relief.id ? (
                    <Link
                      to={`/donations/${relief.id}`}
                      className="ml-4 inline-block text-sm font-medium text-white bg-primary px-3 py-1 rounded-md hover:bg-accent transition"
                    >
                      View Relief
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-black">No active reliefs at the moment.</p>
        )}
      </div>

      {/* Impact Stats */}
      {orgData.impact && (
        <div>
          <h2 className="text-lg font-semibold text-black mb-3">Impact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {orgData.impact.map((yearData, i) => (
              <div
                key={i}
                className="bg-white border text-black border-secondary rounded-lg p-4 shadow-sm"
              >
                <h3 className="font-semibold text-black mb-2">
                  Year {yearData.year}
                </h3>
                <p className="text-sm">👥 People Served: {yearData.people_served}</p>
                <p className="text-sm">✅ Projects Completed: {yearData.projects_completed}</p>
                <p className="text-sm">💰 Funds Raised: ${yearData.funds_raised?.toLocaleString?.() ?? "N/A"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
