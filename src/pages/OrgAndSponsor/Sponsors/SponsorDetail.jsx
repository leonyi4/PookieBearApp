// src/pages/Sponsors/SponsorDetail.jsx
import React, { useMemo } from "react";
import { useParams, Link, useNavigate} from "react-router-dom";
import data from "../../../assets/test_data.json";

export default function SponsorDetail() {
  const { sponsorId } = useParams();
  const navigate = useNavigate();
  const sponsor = (data.sponsors || []).find(
    (s) => s.id === parseInt(sponsorId)
  );

  console.log(sponsor);

  const fundraisers = useMemo(() => {
    if (!sponsor) return [];
    return (data.fundraisers || []).filter(
      (f) => Array.isArray(f.sponsors) && f.sponsors.includes(sponsor.id)
    );
  }, [sponsor]);

  if (!sponsor) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-background min-h-screen">
        <p className="text-red-600">Sponsor not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 text-black">
      {/* Logo / Hero */}
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        className="w-full rounded-lg"
      />

      {/* Memo */}
      <section>
        <h2 className="font-semibold mb-2">Memorandum of Appreciation</h2>
        <p className="text-gray-600 text-sm">{sponsor.memo}</p>
      </section>

      {/* Stats */}
      <section className="flex flex-col space-y-2">
        <h2 className="font-semibold text-lg">Stats</h2>
        <div className="flex space-x-4">
          <div className="border rounded-lg p-3 text-center">
            <p className="font-semibold">{sponsor.stats.peopleHelped}</p>
            <p className="text-xs text-gray-500">People Helped</p>
          </div>
          <div className="border rounded-lg p-3 text-center">
            <p className="font-semibold">{sponsor.stats.donations}</p>
            <p className="text-xs text-gray-500">Total Donations</p>
          </div>
          <div className="border rounded-lg p-3 text-center">
          <p className="font-semibold">{sponsor.stats.events}</p>
          <p className="text-xs text-gray-500">Sponsored Events</p>
        </div>
        </div>
      </section>

      {/* Events */}
      <section>
        <h2 className="font-semibold mb-2">Sponsored Events</h2>
      {sponsor.events.map((event, idx) => (
        <div key={idx}>
          <img
            src={event.image}
            alt={event.title}
            className="w-full rounded-lg mb-2"
          />
          <p className="font-medium">{event.title}</p>
          <p className="text-sm text-gray-500">{event.description}</p>
        </div>
      ))}
      </section>

      {/* Future */}
      <section>
        <h2 className="font-semibold mb-2">Future Events</h2>
        <p className="text-gray-600 text-sm">{sponsor.future}</p>
      </section>
    </div>
  );
}

// return (
//   <div className="max-w-4xl mx-auto p-6 bg-background min-h-screen">
//     <div className="mb-6">
//       <h1 className="text-2xl font-bold text-accent">{sponsor.name}</h1>
//       <img src={sponsor.logo}
//       className='h-50 w-50  mx-auto' alt={sponsor.name} />
//       <p className="text-sm text-gray-600 mb-3">{sponsor.type}</p>
//       <div className="text-sm text-gray-700">
//         <h3 className="font-semibold mb-1">Contributions</h3>
//         <ul className="list-disc pl-5">
//           {(sponsor.contributions || []).map((c, i) => (
//             <li key={i}>{c}</li>
//           ))}
//         </ul>
//       </div>
//     </div>

//     <div>
//       <h2 className="text-lg font-semibold text-accent mb-3">Fundraisers Supported</h2>

//       {fundraisers.length > 0 ? (
//         <ul className="space-y-3">
//           {fundraisers.map((f) => (
//             <li key={f.id} className="bg-white border border-secondary rounded-lg p-4 shadow-sm">
//               <h3 className="font-semibold text-primary">{f.name}</h3>
//               <p className="text-sm text-gray-600">{f.desc}</p>
//               <p className="text-sm mt-1">Raised ${f.raised?.toLocaleString()} / ${f.goal?.toLocaleString()}</p>
//               {f.relief_id && (
//                 <Link to={`/donations/${f.relief_id}`} className="mt-2 inline-block text-sm font-medium text-white bg-primary px-3 py-1 rounded-md hover:bg-accent transition">
//                   View Relief
//                 </Link>
//               )}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-gray-500">No fundraisers found for this sponsor.</p>
//       )}
//     </div>
//   </div>
// );
