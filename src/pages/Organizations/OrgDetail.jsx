// src/pages/Organizations/OrgDetail.jsx
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import data from "../../assets/test_data.json";
import { Star } from "lucide-react";
import DisasterCard from "../Disasters/DisasterCard";

export default function OrgDetail() {
  const { orgId } = useParams();

  // get org data
  const org = data.orgs[orgId - 1] || null;
  // console.log(org)

  // get relief data
  const ongoingReliefData = org.ongoing
    ? org.ongoing.map(
        (reliefId) => data.relief_data.find((r) => r.id === reliefId) || null
      )
    : [];

  // get past relief campaigns from org.reliefs by filtering out ongoing ones
  const pastReliefData = org.reliefs
    ? org.reliefs
        .filter((reliefId) => !org.ongoing.includes(reliefId))
        .map(
          (reliefId) => data.relief_data.find((r) => r.id === reliefId) || null
        )
    : [];
  console.log(pastReliefData);

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-black">
      {/* Header */}
      <div>
        {/* Back Button and Relief Title*/}

        <div className="flex items-center space-x-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="text-primary text-lg hover:text-accent"
          >
            &larr;
          </button>
          <h1 className="text-xl uppercase font-bold text-accent">{org.name}</h1>
        </div>
        <img
          src={org.image}
          alt={org.name}
          className="h-25 w-25 flex items-center mx-auto justify-center rounded-md"
        />
      </div>

      {/* About */}
      <section>
        <h2 className="font-semibold mb-2">About Us</h2>
        <p className="text-gray-600 text-sm">{org.about_us}</p>
      </section>

      {/* Ratings */}
      <section>
        <h2 className="font-semibold mb-2">Ratings</h2>

        <div className="flex flex-col items-start w-full text-accent ">
          <div
            className="my-2 w-full flex p-2 bg-background flex-col space-y-2 
          items-start justify-center space-x-1 border rounded-lg py-2"
          >
            <span className="text-sm font-medium ">AI Credibility Rating</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < org.ratings.ai_rating
                      ? "fill-primary text-primary"
                      : "text-primary"
                  }`}
                />
              ))}
            </div>
          </div>
          <div
            className="my-2 w-full flex flex-col p-2 bg-background space-y-2 items-start 
          justify-center space-x-1 border rounded-lg py-2"
          >
            <span className="text-sm font-medium">Public Rating</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < org.ratings.public_rating
                      ? "fill-primary text-primary"
                      : "text-primary"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ongoing Reliefs */}

      <section>
        <h2 className="font-semibold mb-2">Ongoing Campaigns</h2>
        {ongoingReliefData.length > 0 ? (
          <div className="flex overflow-x-auto w-full overflow-y-hidden space-x-4 pb-2">
            {ongoingReliefData.map((disaster, index) => (
              <DisasterCard key={index} data={disaster} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No ongoing campaigns.</p>
        )}
      </section>

      {/* Impact */}
      <section>
        <h2 className="font-semibold mb-2">Our Impact</h2>
        <div className="space-y-3">
          {org.impact.map((item, idx) => (
            <div key={idx}>
              <img
                src={item.image}
                alt={item.title}
                className="w-full rounded-lg mb-1"
              />
              {/* <p className="font-medium text-center">{item.year}</p> */}
              <div className="flex justify-between space-x-2 text-sm my-2 text-center text-white">
                <p className="font-medium text-accent flex justify-center items-center">
                  {item.year}:
                </p>
                <div className="flex flex-col justify-between border shadow p-1 bg-primary border-accent rounded-md">
                  <p className="text-md font-bold">{item.people_served}</p>
                  <p>People Served </p>
                </div>
                <div className="flex flex-col justify-between border p-1 shadow bg-primary border-accent rounded-md">
                  <p className="text-md font-bold">{item.projects_completed}</p>
                  <p>Projects Completed </p>
                </div>
                <div className="flex flex-col justify-between border p-1 shadow bg-primary border-accent rounded-md">
                  <p className="text-md font-bold">{item.funds_raised}</p>
                  <p>Funds Raised </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past relief campaigns */}
      <section>
        <h2 className="font-semibold mb-2">Past Relief Campaigns</h2>
        {pastReliefData.length > 0 ? (
          <div className="flex overflow-x-auto overflow-y-hidden space-x-4 pb-2">
            {pastReliefData.map((disaster, index) => (
              <DisasterCard key={index} data={disaster} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No past relief campaigns.</p>
        )}
      </section>

      {/* Tracker */}
      <section>
        <h2 className="font-semibold mb-2">Achievements</h2>
        {/* display every achievements */}

        {org.achievements.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col my-2 items-start justify-center p-2 border rounded-lg"
          >
            <p className="font-medium text-md">{item.name}</p>
            <p className="text-sm">{item.details}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

// export default function OrgDetail() {
//   const { orgId } = useParams();

//   // find org (case-sensitive key check)
//   const orgsArray = data.orgs || data.Orgs || []; // tolerant to key name
//   const reliefsArray = data.relief_data || data.reliefData || [];

//   const orgData = orgsArray.find((o) => o.id === parseInt(orgId));

//   // Helper: given an "ongoing" item (id | "123" | object), return the full relief object if possible
//   const resolveRelief = (item) => {
//     if (!item) return null;
//     // numeric id
//     if (typeof item === "number") {
//       return reliefsArray.find((r) => r.id === item) || null;
//     }
//     // numeric string id
//     if (typeof item === "string" && /^\d+$/.test(item)) {
//       return reliefsArray.find((r) => r.id === parseInt(item)) || null;
//     }
//     // object: try to find canonical relief by id if provided, else assume it's already a partial object
//     if (typeof item === "object") {
//       if (item.id) {
//         return reliefsArray.find((r) => r.id === item.id) || item;
//       }
//       return item;
//     }
//     return null;
//   };

//   // Normalize ongoing -> array of full relief objects (filter out nulls)
//   const ongoingReliefs = useMemo(() => {
//     if (!orgData?.ongoing) return [];
//     return orgData.ongoing.map(resolveRelief).filter(Boolean);
//   }, [orgData, reliefsArray]);

//   if (!orgData) {
//     return (
//       <div className="max-w-4xl mx-auto p-6 bg-background min-h-screen">
//         <p className="text-black">Organization not found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-background min-h-screen">
//       {/* Header */}
//       <div className="flex items-start space-x-6 mb-6">
//         <img
//           src={orgData.image}
//           alt={orgData.name}
//           className="w-32 h-32 object-cover rounded-lg shadow-md"
//         />
//         <div>
//           <h1 className="text-2xl font-bold text-black mb-2">
//             {orgData.name}
//           </h1>
//           <p className="text-black mb-3">{orgData.desc}</p>
//           <div className="flex items-center space-x-4 text-sm text-black">
//             <span>⭐ AI: {orgData.ratings?.ai_rating ?? "N/A"}</span>
//             <span>⭐ Public: {orgData.ratings?.public_rating ?? "N/A"}</span>
//           </div>
//         </div>
//       </div>

//       {/* Ongoing Reliefs */}
//       <div className="mb-8">
//         <h2 className="text-lg font-semibold text-black mb-3">
//           Ongoing Relief Campaigns
//         </h2>

//         {ongoingReliefs.length > 0 ? (
//           <ul className="space-y-3">
//             {ongoingReliefs.map((relief) => (
//               <li
//                 key={relief.id}
//                 className="bg-white border border-secondary rounded-lg p-4 shadow-sm"
//               >
//                 <h3 className="font-semibold text-black">{relief.name}</h3>
//                 {relief.desc && (
//                   <p className="text-sm text-black mb-2">{relief.desc}</p>
//                 )}

//                 <div className="flex items-center justify-between">
//                   <div>
//                     {typeof relief.raised !== "undefined" && typeof relief.goal !== "undefined" ? (
//                       <p className="text-sm">
//                         Raised ${relief.raised.toLocaleString()} / $
//                         {relief.goal.toLocaleString()}
//                       </p>
//                     ) : (
//                       <p className="text-sm text-black">No fund info</p>
//                     )}
//                   </div>

//                   {relief.id ? (
//                     <Link
//                       to={`/donations/${relief.id}`}
//                       className="ml-4 inline-block text-sm font-medium text-white bg-primary px-3 py-1 rounded-md hover:bg-accent transition"
//                     >
//                       View Relief
//                     </Link>
//                   ) : null}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-black">No active reliefs at the moment.</p>
//         )}
//       </div>

//       {/* Impact Stats */}
//       {orgData.impact && (
//         <div>
//           <h2 className="text-lg font-semibold text-black mb-3">Impact</h2>
//           <div className="grid gap-4 sm:grid-cols-2">
//             {orgData.impact.map((yearData, i) => (
//               <div
//                 key={i}
//                 className="bg-white border text-black border-secondary rounded-lg p-4 shadow-sm"
//               >
//                 <h3 className="font-semibold text-black mb-2">
//                   Year {yearData.year}
//                 </h3>
//                 <p className="text-sm">👥 People Served: {yearData.people_served}</p>
//                 <p className="text-sm">✅ Projects Completed: {yearData.projects_completed}</p>
//                 <p className="text-sm">💰 Funds Raised: ${yearData.funds_raised?.toLocaleString?.() ?? "N/A"}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
