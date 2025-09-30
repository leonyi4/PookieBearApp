import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchSponsorById,
  fetchSponsorEvents,
  fetchSponsorDonations,
  fetchSponsorVolunteers,
  fetchSponsorOrganizations,
} from "../../../lib/api";
import DonationCard from "../../DonationsAndVolunteer/Donations/DonationCard";
import VolunteerCard from "../../DonationsAndVolunteer/Volunteer/VolunteerCard";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function SponsorDetail() {
  const { sponsorId } = useParams();
  const navigate = useNavigate();

  const {
    data: sponsor,
    isLoading: loadingSponsor,
    error: sponsorError,
  } = useQuery({
    queryKey: ["sponsor", sponsorId],
    queryFn: () => fetchSponsorById(sponsorId),
    enabled: !!sponsorId,
  });

  const { data: events, isLoading: loadingEvents } = useQuery({
    queryKey: ["sponsorEvents", sponsorId],
    queryFn: () => fetchSponsorEvents(sponsorId),
    enabled: !!sponsorId,
  });

  const { data: donations, isLoading: loadingDonations } = useQuery({
    queryKey: ["sponsorDonations", sponsorId],
    queryFn: () => fetchSponsorDonations(sponsorId),
    enabled: !!sponsorId,
  });

  const { data: volunteers, isLoading: loadingVolunteers } = useQuery({
    queryKey: ["sponsorVolunteers", sponsorId],
    queryFn: () => fetchSponsorVolunteers(sponsorId),
    enabled: !!sponsorId,
  });

  const { data: organizations, isLoading: loadingOrgs } = useQuery({
    queryKey: ["sponsorOrganizations", sponsorId],
    queryFn: () => fetchSponsorOrganizations(donations, volunteers),
    enabled: !!sponsorId && !!donations && !!volunteers,
  });

  if (
    loadingSponsor ||
    loadingEvents ||
    loadingDonations ||
    loadingVolunteers ||
    loadingOrgs
  ) {
    return <LoadingSpinner message="Fetching sponsor details..." />;
  }

  if (sponsorError || !sponsor) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-background min-h-screen">
        <p className="text-red-600">Sponsor not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 text-primary">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="text-primary text-lg hover:text-accent"
        >
          &larr;
        </button>
        <h1 className="text-xl font-bold uppercase text-primary">
          {sponsor.name}
        </h1>
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
                className="border border-gray-500 rounded-lg p-3 text-center flex flex-col bg-secondary "
              >
                <p className="font-semibold text-white">{value}</p>
                <p className="text-xs text-accent capitalize">
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
        {organizations?.length > 0 ? (
          <ul className="space-y-3">
            {organizations.map((org) => (
              <li key={org.id} className="flex items-center space-x-3 ">
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
        {donations?.length > 0 ? (
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
        {volunteers?.length > 0 ? (
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
        {events?.length > 0 ? (
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
