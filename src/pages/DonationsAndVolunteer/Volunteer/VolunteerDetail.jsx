import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../lib/supabase-client";
import RatingStars from "../../../components/RatingStars";
import LocationMap from "../../../components/LocationMap";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function VolunteerDetail() {
  const { volunteerId } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [orgData, setOrgData] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        setLoading(true);

        const { data: volunteer } = await supabase
          .from("volunteers")
          .select(
            `
            id,
            name,
            description,
            image,
            impact,
            org_id,
            latitude,
            longitude
          `
          )
          .eq("id", volunteerId)
          .single();
        setCampaign(volunteer);

        if (volunteer?.org_id) {
          const { data: org } = await supabase
            .from("organizations")
            .select("id, name, logo, tags, ratings")
            .eq("id", volunteer.org_id)
            .single();
          setOrgData(org);
        }

        const { data: roleLinks } = await supabase
          .from("volunteer_roles")
          .select(
            `
            roles (
              id,
              title,
              commitment,
              skills_required
            )
          `
          )
          .eq("volunteer_id", volunteerId);

        setRoles(roleLinks?.map((r) => r.roles) || []);
      } catch (err) {
        console.error("Error fetching volunteer detail:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteer();
  }, [volunteerId]);

  if (loading)
    return <LoadingSpinner message="Fetching Volunteer Details..." />;
  if (!campaign)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Volunteer opportunity not found.
      </div>
    );

  const signedUp = campaign.impact?.volunteers_signed_up ?? 0;
  const needed = campaign.impact?.volunteers_needed ?? 0;
  const progress = needed
    ? Math.min((signedUp / needed) * 100, 100).toFixed(0)
    : 0;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden my-6">
      {/* Header */}
      <div className="flex items-center space-x-4 p-4 sm:p-6 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="text-primary text-lg hover:text-accent"
        >
          &larr;
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          {campaign.name}
        </h2>
      </div>

      {/* Hero Image */}
      {campaign.image && (
        <img
          src={campaign.image}
          alt={campaign.name}
          className="w-full h-48 sm:h-64 lg:h-80 object-cover"
        />
      )}

      <div className="p-4 sm:p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>

        {/* Org Info */}
        {orgData && (
          <div className="flex items-center space-x-3">
            <img
              src={orgData.logo}
              alt={orgData.name}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full"
            />
            <div>
              <Link to={`/OrgsAndSponsors/organizations/${orgData.id}`}>
                <p className="font-medium text-gray-800">{orgData.name}</p>
              </Link>
              {orgData.tags?.[0] && (
                <p className="text-xs text-gray-500">{orgData.tags[0]}</p>
              )}
            </div>
          </div>
        )}

        {/* Ratings */}
        {orgData?.ratings && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-accent">
            <div className="flex flex-col items-center border rounded-lg py-3">
              <span className="text-sm font-medium">Public Rating</span>
              <RatingStars
                rating={orgData.ratings.public_rating}
                maxStars={5}
              />
            </div>
            <div className="flex flex-col items-center border rounded-lg py-3">
              <span className="text-sm font-medium">AI Rating</span>
              <RatingStars rating={orgData.ratings.ai_rating} maxStars={5} />
            </div>
          </div>
        )}

        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1 text-black">
            <span>
              Signed Up:{" "}
              <span className="font-semibold text-gray-800">{signedUp}</span>
            </span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">Needed: {needed}</p>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          {campaign.description}
        </p>

        {/* Roles */}
        {roles.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Volunteer Roles
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="p-3 border rounded-lg bg-gray-50 space-y-1"
                >
                  <p className="font-medium text-gray-800">{role.title}</p>
                  <p className="text-sm text-gray-600">
                    Commitment: {role.commitment}
                  </p>
                  {role.skills_required && (
                    <p className="text-xs text-gray-500">
                      Skills: {role.skills_required.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        {campaign.latitude && campaign.longitude && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Disaster Location
            </h2>
            <div className="h-40 lg:h-72 rounded-lg overflow-hidden">
              <LocationMap
                position={[campaign.latitude, campaign.longitude]}
                label={campaign.name}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <button className="w-full bg-primary text-white py-2 sm:py-3 rounded-lg hover:bg-accent transition">
          Sign Up to Volunteer
        </button>
      </div>
    </div>
  );
}
