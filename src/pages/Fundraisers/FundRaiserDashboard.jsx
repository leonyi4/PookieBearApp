import React from 'react'
import data from "../../assets/test_data.json";
import FundRaiserCard from './FundRaiserCard';

const fundraisers = data.fundraisers || [];




export default function FundraiserDashboard() {
  // // 🚀 Eventually, fetch real fundraiser data from API
  // const fundraiser = {
  //   name: "Rebuild Homes After Flood",
  //   description:
  //     "Raising funds to help families rebuild after the recent flooding disaster.",
  //   goal: 50000,
  //   raised: 18500,
  //   category: "Housing",
  //   organization: "Relief Alliance",
  //   location: "Springfield, USA",
  // };

  return (

    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Fundraiser Dashboard
      </h1>

      {fundraisers.length === 0 && (
        <p className="text-gray-600">No fundraisers available.</p>
      )}
      {fundraisers.length > 0 && 
        fundraisers.map((fundraisers) => (
          <FundRaiserCard key={fundraisers.id} fundraiser={fundraisers} />
        ))}
    </div>
  );
}
