// src/pages/Organizations/OrgDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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

  // Fetch org + related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Organization
        const { data: orgData, error: orgError } = await supabase
          .from("organizations")
          .select("*")
          .eq("id", orgId)
          .single();
        if (orgError) throw orgError;
        setOrg(orgData);

        // 2. Donations linked to org
        const { data: donationData, error: donationError } = await supabase
          .from("donations")
          .select("*")
          .eq("org_id", orgId);
        if (donationError) throw donationError;
        setDonations(donationData || []);

        // 3. Volunteers linked to org
        const { data: volunteerData, error: volunteerError } = await supabase
          .from("volunteers")
          .select("*")
          .eq("org_id", orgId);
        if (volunteerError) throw volunteerError;
        setVolunteers(volunteerData || []);
      } catch (err) {
        console.error("Error fetching org details:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orgId]);

  if (loading) {
    return <LoadingSpinner message="Fetching organization details..." />;
  }

  if (!org) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Organization not found
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-black">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="text-primary text-lg hover:text-accent"
          >
            &larr;
          </button>
          <h1 className="text-xl uppercase font-bold text-accent">
            {org.name}
          </h1>
        </div>
        <img
          src={org.logo}
          alt={org.name}
          className="h-25 w-25 mx-auto rounded-md object-contain"
        />
      </div>

      {/* About */}
      <section>
        <h2 className="font-semibold mb-2">About Us</h2>
        <p className="text-gray-600 text-sm">{org.about_us}</p>
      </section>

      {/* Ratings */}
      {org.ratings && (
        <section>
          <h2 className="font-semibold mb-2">Ratings</h2>
          <div className="flex flex-col items-start w-full text-accent">
            <div className="my-2 w-full flex flex-col p-2 bg-background border rounded-lg">
              <span className="text-sm font-medium">AI Credibility Rating</span>
              <RatingStars rating={org.ratings.ai_rating} maxStars={5} />
            </div>
            <div className="my-2 w-full flex flex-col p-2 bg-background border rounded-lg">
              <span className="text-sm font-medium">Public Rating</span>
              <RatingStars rating={org.ratings.public_rating} maxStars={5} />
            </div>
          </div>
        </section>
      )}

      {/* Ongoing Donations */}
      <section>
        <h2 className="font-semibold mb-2">Donations</h2>
        {donations.length > 0 ? (
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {donations.map((donation) => (
              <DonationCard key={donation.id} data={donation} className='w-60' />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No donation campaigns found.</p>
        )}
      </section>

      {/* Volunteer Campaigns */}
      <section>
        <h2 className="font-semibold mb-2">Volunteer Campaigns</h2>
        {volunteers.length > 0 ? (
          <div className="flex overflow-x-auto space-x-4 pb-2">
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
          <div className="flex flex-wrap gap-3">
            {Object.entries(org.impact).map(([key, val], idx) => (
              <div
                key={idx}
                className="border text-xs shadow p-2 bg-primary text-white rounded-md"
              >
                <p className="text-sm font-bold">{val}</p>
                <p>{key}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {org.achievements && org.achievements.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">Achievements</h2>
          {org.achievements.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col my-2 px-2 py-1 border rounded-lg bg-secondary"
            >
              <div className="flex justify-between">
                <p className="font-medium text-md text-white">{item.title}</p>
                <p className="text-accent text-sm">{item.year}</p>
              </div>
              <hr className="border-accent w-full" />
              <p className="text-accent text-sm">{item.description}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
