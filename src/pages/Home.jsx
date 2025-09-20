import { Link } from "react-router-dom";
import data from "../assets/test_data.json";
import DisasterCard from "./Disasters/DisasterCard";
import MiniMap from "./Disasters/MiniMap";
import DisasterMap from "./Disasters/DisasterMap"; // adjust the path if necessary
// console.log(data.relief_data);

export default function Home() {
  return (
    <div className="space-y-4">
      {/* Donation Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 uppercase">
            Donation
          </h2>
          <Link to="/donations" className="text-primary font-semibold">
            View All
          </Link>
        </div>
        <div className="flex overflow-x-auto overflow-y-hidden space-x-4 pb-2">
          {data.relief_data.map((disaster, index) => (
            <DisasterCard key={index} data={disaster} />
          ))}
        </div>
      </section>

      {/* Organizations Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 uppercase">
            Organizations
          </h2>
          <Link to="/OrgsAndSponsors/organizations" className="text-primary font-semibold">
            View All
          </Link>
        </div>

        <ul className="space-y-3">
          {data.orgs.slice(0, 3).map((org, index) => (
            <li key={index} className="flex items-center space-x-3">
              <img
                src={org.logo}
                alt={org.name}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <Link to={`/OrgsAndSponsors/organizations/${org.id}`} className="font-medium text-gray-800">{org.name}</Link>
                <p className="text-xs text-gray-500">{org.tags[0]}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Sponsors Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 uppercase">
            Active Sponsors
          </h2>
          <Link to="/OrgsAndSponsors/sponsors" className="text-primary font-semibold">
            View All
          </Link>
        </div>
        <div className="flex overflow-x-auto overflow-y-hidden space-x-4">
          {data.sponsors.map((sponsor, index) => (
            <Link to={`OrgsAndSponsors/sponsors/${sponsor.id}`} key={index} className="flex items-center gap-2">
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-12 w-12 object-contain"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Real Time Updates Section */}
<section>
  <h2 className="text-xl font-bold text-gray-900 mb-4">
    Real Time Updates
  </h2>
  <div className="rounded-xl overflow-hidden shadow">
    <MiniMap /> {/* use preview map instead of full DisasterMap */}
  </div>
  <div className="mt-4 space-y-2">
    <Link to="/DisasterMap">
      <button className="w-full bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700">
        View Now
      </button>
    </Link>
    <button className="w-full mt-2 bg-gray-800 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-900">
      Learn More About Us
    </button>
  </div>
</section>

    </div>
  );
}

      {/* Fundraising Section
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase">
          Fundraising
        </h2>
        <div className="rounded-xl overflow-hidden shadow bg-green-100 h-28 flex items-center justify-center">
          <span className="text-green-700 font-semibold">
            🌱 Empower Communities
          </span>
        </div>
        <Link to="/StartFundraiser">
          <button className="mt-4 w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700">
            Start Your Own Fundraiser
          </button>
        </Link>
      </section> */}
