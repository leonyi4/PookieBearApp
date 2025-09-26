import { Link } from "react-router-dom";
import DonationCard from "./DonationsAndVolunteer/Donations/DonationCard";
import MiniMap from "./Disasters/MiniMap";
import VolunteerCard from "./DonationsAndVolunteer/Volunteer/VolunteerCard";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase-client";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: donationsData } = await supabase
          .from("donations")
          .select(
            "id, name, description, goal, raised, latitude, longitude, disaster_id, image"
          );
        setDonations((donationsData || []).sort((a, b) => a.id - b.id));

        const { data: volunteersData } = await supabase
          .from("volunteers")
          .select(
            "id, name, description, latitude, longitude, disaster_id, impact, image"
          );
        setVolunteers((volunteersData || []).sort((a, b) => a.id - b.id));

        const { data: orgsData } = await supabase
          .from("organizations")
          .select("id, name, logo, tags");
        setOrgs((orgsData || []).sort((a, b) => a.id - b.id));

        const { data: sponsorsData } = await supabase
          .from("sponsors")
          .select("id, name, logo");
        setSponsors((sponsorsData || []).sort((a, b) => a.id - b.id));
      } catch (err) {
        console.error("Error fetching home data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Fetching Home..." />;

  return (
    <div className="space-y-10 p-4 md:p-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Aid Request CTA */}
        <section className="rounded-2xl p-5 bg-gradient-to-r from-primary to-secondary text-white shadow">
          <h2 className="text-2xl font-bold uppercase ">Do You Need Help Right Now?</h2>
          <p className="text-sm lg:text-md mt-2 opacity-90">
            If you’re affected by a disaster, tell us what you need and where you are.
          </p>
          <div className="mt-4">
            <Link to="/AidRequest">
              <button className="w-full bg-white text-accent font-semibold py-2 rounded-lg hover:bg-gray-100">
                Request Aid
              </button>
            </Link>
          </div>
        </section>

        {/* Donation Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-accent uppercase">
              Donations
            </h2>
            <Link
              to="DonationsAndVolunteers/donations"
              className="text-primary font-semibold"
            >
              View All
            </Link>
          </div>

          {/* Vertical grid for large, horizontal scroll for small/medium */}
          <div className=" grid-cols-1 sm:grid-cols-2 gap-4 lg:grid hidden">
            {donations.map((donation) => (
              <Link
                key={donation.id}
                to={`/DonationsAndVolunteers/donations/${donation.id}`}
              >
                <DonationCard home={true} data={donation} />
              </Link>
            ))}
          </div>

          <div className="flex lg:hidden overflow-x-auto space-x-4 pb-2">
            {donations.map((donation) => (
              <Link
                key={donation.id}
                to={`/DonationsAndVolunteers/donations/${donation.id}`}
              >
                <DonationCard home={true} data={donation} className="w-60" />
              </Link>
            ))}
          </div>
        </section>

        {/* Volunteer Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-accent uppercase">
              Volunteers
            </h2>
            <Link
              to="DonationsAndVolunteers/volunteers"
              className="text-primary font-semibold"
            >
              View All
            </Link>
          </div>

          {/* Vertical grid for large */}
          <div className="hidden grid-cols-1 sm:grid-cols-2 gap-4 lg:grid">
            {volunteers.map((vol) => (
              <Link
                key={vol.id}
                to={`/DonationsAndVolunteers/volunteers/${vol.id}`}
              >
                <VolunteerCard data={vol} home={true} />
              </Link>
            ))}
          </div>

          {/* Horizontal scroll for small/medium */}
          <div className="flex lg:hidden overflow-x-auto space-x-4 pb-2">
            {volunteers.map((vol) => (
              <Link
                key={vol.id}
                to={`/DonationsAndVolunteers/volunteers/${vol.id}`}
              >
                <VolunteerCard
                  data={vol}
                  home={true}
                  className="w-60 sm:w-72"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Organizations Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-accent uppercase">
              Organizations
            </h2>
            <Link
              to="/OrgsAndSponsors/organizations"
              className="text-primary font-semibold"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orgs.slice(0, 3).map((org) => (
              <Link
                key={org.id}
                to={`/OrgsAndSponsors/organizations/${org.id}`}
                className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow hover:shadow-md"
              >
                <img
                  src={org.logo}
                  alt={org.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{org.name}</p>
                  <p className="text-xs text-gray-500">{org.tags?.[0]}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Sponsors Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-accent uppercase">
              Active Sponsors
            </h2>
            <Link
              to="/OrgsAndSponsors/sponsors"
              className="text-primary font-semibold"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {sponsors.map((sponsor) => (
              <Link
                key={sponsor.id}
                to={`OrgsAndSponsors/sponsors/${sponsor.id}`}
                className="flex items-center justify-center bg-white p-3 rounded-lg shadow hover:shadow-md"
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

        {/* Real Time Updates */}
        <section>
          <h2 className="text-xl font-bold text-accent mb-4">
            Real Time Updates
          </h2>
          <div className="rounded-xl overflow-hidden shadow">
            <MiniMap />
          </div>
          <div className="mt-2 space-y-2">
            <Link to="/DisasterMap">
              <button className="w-full bg-primary text-white font-medium py-2 rounded-lg hover:bg-primary-dark">
                View Now
              </button>
            </Link>
            <button className="mt-1 w-full bg-accent text-white font-medium py-2 rounded-lg hover:bg-accent/90">
              Learn More About Us
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
