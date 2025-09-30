import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase-client";
import DonationCard from "../../DonationsAndVolunteer/Donations/DonationCard";
import VolunteerCard from "../../DonationsAndVolunteer/Volunteer/VolunteerCard";
import RatingStars from "../../../components/RatingStars";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function OrgDetail() {
  const { orgId } = useParams();
  const navigate = useNavigate();

  const [org, setOrg] = useState(null);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: orgData } = await supabase
          .from("organizations")
          .select("*")
          .eq("id", orgId)
          .single();
        setOrg(orgData);

        const { data: donationData } = await supabase
          .from("donations")
          .select("*")
          .eq("org_id", orgId);
        setDonations(donationData || []);

        const { data: volunteerData } = await supabase
          .from("volunteers")
          .select("*")
          .eq("org_id", orgId);
        setVolunteers(volunteerData || []);
      } catch (err) {
        console.error("Error fetching org details:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orgId]);

  // 🔹 Utility to make keys human-readable
  const formatKey = (str) => {
    if (!str) return "";
    return str
      .replace(/_/g, " ") // snake_case -> words
      .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase -> words
      .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-primary">
        <LoadingSpinner message="Fetching organization details..." />
      </div>
    );

  if (!org) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Organization not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 text-primary">
      {/* Header */}
      <div className="flex items-center space-x-4 justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-primary text-lg hover:text-accent"
        >
          &larr;
        </button>
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary uppercase flex-1 text-center">
          {org.name}
        </h1>
      </div>
      <img
        src={org.logo}
        alt={org.name}
        className="max-h-64 mx-auto rounded-md object-contain"
      />

      {/* About */}
      {org.about_us && (
        <section>
          <h2 className="font-semibold mb-2">About Us</h2>
          <p className="text-gray-600 text-sm">{org.about_us}</p>
        </section>
      )}

      {/* Ratings */}
      {org.ratings && (
        <section>
          <h2 className="font-semibold mb-2">Ratings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-accent">
            <div className="flex flex-col p-2 bg-background border rounded-lg">
              <span className="text-sm font-medium">AI Credibility Rating</span>
              <RatingStars rating={org.ratings.ai_rating} maxStars={5} />
            </div>
            <div className="flex flex-col p-2 bg-background border rounded-lg">
              <span className="text-sm font-medium">Public Rating</span>
              <RatingStars rating={org.ratings.public_rating} maxStars={5} />
            </div>
          </div>
        </section>
      )}

      {/* Donations */}
      <section>
        <h2 className="font-semibold mb-2">Donations</h2>
        {donations.length > 0 ? (
          <div className="grid grid-flow-col auto-cols-[75%] md:auto-cols-[45%] lg:auto-cols-[30%] overflow-x-auto gap-4 pb-2">
            {donations.map((donation) => (
              <DonationCard key={donation.id} data={donation} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No donation campaigns found.</p>
        )}
      </section>

      {/* Volunteers */}
      <section>
        <h2 className="font-semibold mb-2">Volunteer Campaigns</h2>
        {volunteers.length > 0 ? (
          <div className="grid grid-flow-col auto-cols-[75%] md:auto-cols-[45%] lg:auto-cols-[30%] overflow-x-auto gap-4 pb-2">
            {volunteers.map((vol) => (
              <VolunteerCard key={vol.id} data={vol} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No volunteer campaigns found.</p>
        )}
      </section>

      {/* Impact */}
      {org.impact && (
        <section>
          <h2 className="font-semibold mb-2">Our Impact</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Object.entries(org.impact).map(([key, val], idx) => (
              <div
                key={idx}
                className="border shadow p-2 bg-primary text-white rounded-md text-center"
              >
                <p className="text-lg font-bold">{val}</p>
                <p className="text-xs">{formatKey(key)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {org.achievements?.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">Achievements</h2>
          <div className="space-y-3">
            {org.achievements.map((item, idx) => (
              <div
                key={idx}
                className="px-3 py-2 border rounded-lg bg-secondary"
              >
                <div className="flex justify-between">
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-accent text-sm">{item.year}</p>
                </div>
                <hr className="border-accent my-1" />
                <p className="text-accent text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
