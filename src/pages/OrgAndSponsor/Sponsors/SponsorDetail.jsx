// src/pages/Sponsors/SponsorDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../lib/supabase-client";
import DonationCard from "../../DonationsAndVolunteer/Donations/DonationCard";
import VolunteerCard from "../../DonationsAndVolunteer/Volunteer/VolunteerCard";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function SponsorDetail() {
  const { sponsorId } = useParams();
  const navigate = useNavigate();

  const [sponsor, setSponsor] = useState(null);
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsorData = async () => {
      try {
        setLoading(true);

        // Sponsor info
        const { data: sponsorData, error: sponsorError } = await supabase
          .from("sponsors")
          .select("*")
          .eq("id", sponsorId)
          .single();
        if (sponsorError) throw sponsorError;
        setSponsor(sponsorData);

        // Sponsored events
        const { data: eventData, error: eventError } = await supabase
          .from("sponsor_events")
          .select("*")
          .eq("sponsor_id", sponsorId);
        if (eventError) throw eventError;
        setEvents(eventData || []);

        // Sponsored donations
        const { data: donationLinks } = await supabase
          .from("sponsor_donations")
          .select("donation_id")
          .eq("sponsor_id", sponsorId);
        if (donationLinks?.length) {
          const ids = donationLinks.map((d) => d.donation_id);
          const { data: donationsData } = await supabase
            .from("donations")
            .select("*")
            .in("id", ids);
          setDonations(donationsData || []);
        }

        // Sponsored volunteers
        const { data: volunteerLinks } = await supabase
          .from("sponsor_volunteers")
          .select("volunteer_id")
          .eq("sponsor_id", sponsorId);
        if (volunteerLinks?.length) {
          const ids = volunteerLinks.map((v) => v.volunteer_id);
          const { data: volunteersData } = await supabase
            .from("volunteers")
            .select("*")
            .in("id", ids);
          setVolunteers(volunteersData || []);
        }

        // Related Orgs (via donations + volunteers)
        const { data: orgDonationLinks } = await supabase
          .from("org_donations")
          .select("org_id")
          .in("donation_id", donationLinks?.map((d) => d.donation_id) || []);
        const { data: orgVolunteerLinks } = await supabase
          .from("org_volunteers")
          .select("org_id")
          .in("volunteer_id", volunteerLinks?.map((v) => v.volunteer_id) || []);

        const orgIds = [
          ...(orgDonationLinks?.map((o) => o.org_id) || []),
          ...(orgVolunteerLinks?.map((o) => o.org_id) || []),
        ];

        if (orgIds.length > 0) {
          const { data: relatedOrgs } = await supabase
            .from("organizations")
            .select("*")
            .in("id", orgIds);
          setOrganizations(relatedOrgs || []);
        }
      } catch (err) {
        console.error("Error loading sponsor details:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorData();
  }, [sponsorId]);

  if (loading) return <LoadingSpinner message="Fetching sponsor details..." />;

  if (!sponsor) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-background min-h-screen">
        <p className="text-red-600">Sponsor not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 text-black">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="text-primary text-lg hover:text-accent"
        >
          &larr;
        </button>
        <h1 className="text-xl font-bold uppercase">{sponsor.name}</h1>
      </div>

      {/* Logo */}
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        className="max-h-64 mx-auto rounded-md object-contain"
      />

      {/* Memo */}
      {sponsor.memo && (
        <section>
          <h2 className="font-semibold mb-2">Memorandum of Appreciation</h2>
          <p className="text-gray-600 text-sm">{sponsor.memo}</p>
        </section>
      )}

      {/* Stats */}
      {sponsor.stats && (
        <section>
          <h2 className="font-semibold mb-2">Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Object.entries(sponsor.stats).map(([key, value], idx) => (
              <div
                key={idx}
                className="border rounded-lg p-3 text-center flex flex-col"
              >
                <p className="font-semibold">{value}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Organizations */}
      <section>
        <h2 className="font-semibold mb-2">Related Organizations</h2>
        {organizations.length > 0 ? (
          <ul className="space-y-3">
            {organizations.map((org) => (
              <li key={org.id} className="flex items-center space-x-3">
                <img
                  src={org.logo}
                  alt={org.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <Link
                    to={`/OrgsAndSponsors/organizations/${org.id}`}
                    className="font-medium text-gray-800 hover:text-primary"
                  >
                    {org.name}
                  </Link>
                  {org.tags && (
                    <p className="text-xs text-gray-500">{org.tags[0]}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">
            No organizations linked to this sponsor yet.
          </p>
        )}
      </section>

      {/* Donations */}
      <section>
        <h2 className="font-semibold mb-2">Sponsored Donations</h2>
        {donations.length > 0 ? (
          <div className="grid grid-flow-col auto-cols-[75%] md:auto-cols-[45%] lg:auto-cols-[30%] overflow-x-auto gap-4 pb-2">
            {donations.map((d) => (
              <DonationCard key={d.id} data={d} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No donations sponsored.</p>
        )}
      </section>

      {/* Volunteers */}
      <section>
        <h2 className="font-semibold mb-2">Sponsored Volunteer Campaigns</h2>
        {volunteers.length > 0 ? (
          <div className="grid grid-flow-col auto-cols-[75%] md:auto-cols-[45%] lg:auto-cols-[30%] overflow-x-auto gap-4 pb-2">
            {volunteers.map((v) => (
              <VolunteerCard key={v.id} data={v} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No volunteer campaigns sponsored.
          </p>
        )}
      </section>

      {/* Events */}
      <section>
        <h2 className="font-semibold mb-2">Sponsored Events</h2>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-50 p-3 rounded-lg shadow-sm"
              >
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-gray-500">{event.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No events found.</p>
        )}
      </section>

      {/* Future */}
      {sponsor.future && (
        <section>
          <h2 className="font-semibold mb-2">Future Plans</h2>
          <p className="text-gray-600 text-sm">{sponsor.future}</p>
        </section>
      )}
    </div>
  );
}
