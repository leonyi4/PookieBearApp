import { Link } from "react-router-dom";
import DonationCard from "./DonationsAndVolunteer/Donations/DonationCard";
import MiniMap from "./Disasters/MiniMap";
import VolunteerCard from "./DonationsAndVolunteer/Volunteer/VolunteerCard";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase-client";
import LoadingSpinner from "../components/LoadingSpinner";
import AidRequestCard from "./AidRequest/AidRequestCard";

export default function Home() {
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch donations
        const { data: donationsData, error: donationsError } = await supabase
          .from("donations")
          .select(
            "id, name, description, goal, raised, latitude, longitude, disaster_id, image"
          );

        if (donationsError) throw donationsError;
        const sortedDonations = (donationsData || []).sort(
          (a, b) => a.id - b.id
        );
        setDonations(sortedDonations);

        // console.log(donationsData)
        // Fetch volunteers
        const { data: volunteersData, error: volunteersError } = await supabase
          .from("volunteers")
          .select(
            "id, name, description, latitude, longitude, disaster_id, impact, image"
          );

        if (volunteersError) throw volunteersError;
        const sortedVolunteers = (volunteersData || []).sort(
          (a, b) => a.id - b.id
        );
        setVolunteers(sortedVolunteers);

        // console.log(volunteersData);

        // Fetch organizations
        const { data: orgsData, error: orgsError } = await supabase
          .from("organizations")
          .select("id, name, logo, tags");

        if (orgsError) throw orgsError;
        const sortedOrgs = (orgsData || []).sort((a, b) => a.id - b.id);
        setOrgs(sortedOrgs);

        // Fetch sponsors
        const { data: sponsorsData, error: sponsorsError } = await supabase
          .from("sponsors")
          .select("id, name, logo");

        if (sponsorsError) throw sponsorsError;
        const sortedSponsors = (sponsorsData || []).sort((a, b) => a.id - b.id);
        setSponsors(sortedSponsors);
      } catch (err) {
        console.error("Error fetching home data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Fetching Home..." />;
  }

  return (
    <div className="space-y-4 p-4">
      {/* Customize Profile Button */}
      <div className="flex justify-end mb-4">
        <Link
          to="/profile"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Customize Profile
        </Link>
      </div>

      {/* Aid Requests Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 uppercase">
            Aid Requests
          </h2>
          <Link to="/AidRequest" className="text-primary font-semibold">
            Make a Request
          </Link>
        </div>
        {/* <div className="space-y-3">
          {aidRequests.map((req) => (
            <AidRequestCard key={req.id} request={req} />
          ))}
        </div> */}
      </section>

      {/* Donation Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 uppercase">
            Donation
          </h2>
          <Link
            to="DonationsAndVolunteers/donations"
            className="text-primary font-semibold"
          >
            View All
          </Link>
        </div>
        <div className="flex overflow-x-scroll overflow-y-hidden space-x-4 pb-2">
          {donations.map((disaster, index) => (
            <Link
              key={index}
              to={`/DonationsAndVolunteers/donations/${disaster.id}`}
            >
              <DonationCard className="w-60" home={true} data={disaster} />
            </Link>
          ))}
        </div>
      </section>

      {/* Volunteer Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 uppercase">
            Volunteer
          </h2>
          <Link
            to="DonationsAndVolunteers/volunteers"
            className="text-primary font-semibold"
          >
            View All
          </Link>
        </div>
        <div className="flex overflow-x-auto overflow-y-hidden space-x-4 pb-2">
          {volunteers.map((vol, index) => (
            <Link
              key={index}
              to={`/DonationsAndVolunteers/volunteers/${vol.id}`}
            >
              <VolunteerCard data={vol} home={true} className="w-60 sm:w-72" />
            </Link>
          ))}
        </div>
      </section>

      {/* Organizations Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 uppercase">
            Organizations
          </h2>
          <Link
            to="/OrgsAndSponsors/organizations"
            className="text-primary font-semibold"
          >
            View All
          </Link>
        </div>
        <ul className="space-y-3">
          {orgs.slice(0, 3).map((org, index) => (
            <li key={index} className="flex items-center space-x-3">
              <img
                src={org.logo}
                alt={org.name}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <Link
                  to={`/OrgsAndSponsors/organizations/${org.id}`}
                  className="font-medium text-gray-800"
                >
                  {org.name}
                </Link>
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
          </h2>{" "}
          <Link
            to="/OrgsAndSponsors/sponsors"
            className="text-primary font-semibold"
          >
            View All
          </Link>
        </div>
        <div className="flex overflow-x-auto overflow-y-hidden space-x-4">
          {sponsors.map((sponsor, index) => (
            <Link
              to={`OrgsAndSponsors/sponsors/${sponsor.id}`}
              key={index}
              className="flex items-center gap-2"
            >
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
