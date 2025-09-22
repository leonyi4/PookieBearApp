// src/pages/Sponsors/SponsorsList.jsx
import React from "react";
import { Link } from "react-router-dom";
import data from "../../../assets/test_data.json";

export default function Sponsors() {
  const sponsors = data.sponsors || [];

  return (
    <div className="max-w-6xl mx-auto p-4 bg-background min-h-screen">
      <h1 className="text-2xl font-bold text-accent mb-6">Sponsors</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sponsors.map((s) => (
          <Link
            key={s.id}
            to={`/sponsors/${s.id}`}
            className="bg-white border border-secondary rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-4 flex flex-col"
          >
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-accent mb-2">{s.name}</h2>
              <p className="text-sm text-gray-600 mb-3">{s.type}</p>
              <ul className="text-sm text-gray-700 list-disc pl-5">
                {(s.contributions || []).slice(0, 3).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              View details →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
