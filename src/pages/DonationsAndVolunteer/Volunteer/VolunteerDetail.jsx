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

        // 1. Volunteer core info
        const { data: volunteer, error } = await supabase
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

        if (error) throw error;
        setCampaign(volunteer);

        // 2. Organization
        if (volunteer.org_id) {
          const { data: org, error: orgError } = await supabase
            .from("organizations")
            .select("id, name, logo, tags, ratings")
            .eq("id", volunteer.org_id)
            .single();

          if (orgError) throw orgError;
          setOrgData(org);
        }

        // 3. Roles via join table
        const { data: roleLinks, error: roleError } = await supabase
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

        if (roleError) throw roleError;

        const roleList = roleLinks.map((r) => r.roles);
        setRoles(roleList || []);
      } catch (err) {
        console.error("Error fetching volunteer detail:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteer();
  }, [volunteerId]);

  if (loading) {
    return <LoadingSpinner message="Fetching Volunteer Details..." />;
  }

  if (!campaign) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Volunteer opportunity not found.
      </div>
    );
  }

  // Calculate progress from impact JSON
  const signedUp = campaign.impact?.volunteers_signed_up ?? 0;
  const needed = campaign.impact?.volunteers_needed ?? 0;
  const progress = needed
    ? Math.min((signedUp / needed) * 100, 100).toFixed(0)
    : 0;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Back Button */}
      <div className="flex items-center space-x-4 p-6">
        <button
          onClick={() => navigate(-1)}
          className="text-primary text-lg hover:text-accent"
        >
          &larr;
        </button>
        <h2 className="text-lg font-semibold text-gray-900">{campaign.name}</h2>
      </div>

      {/* Hero Image */}
      {campaign.image && (
        <img
          src={campaign.image}
          alt={campaign.name}
          className="w-full h-56 object-cover"
        />
      )}

      <div className="p-6 space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>

        {/* Organization Info */}
        {orgData && (
          <div className="flex items-center space-x-3">
            <img
              src={orgData.logo}
              alt={orgData.name}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <Link to={`/OrgsAndSponsors/organizations/${orgData.id}`}>
                <p className="font-medium text-gray-800">{orgData.name}</p>
              </Link>
              {orgData.tags && (
                <p className="text-xs text-gray-500">{orgData.tags[0]}</p>
              )}
            </div>
          </div>
        )}

        {/* Ratings */}
        {orgData?.ratings && (
          <div className="grid grid-cols-2 gap-3 text-accent">
            <div className="flex flex-col items-center border rounded-lg py-2">
              <span className="text-sm font-medium">Public Rating</span>
              <RatingStars
                rating={orgData.ratings.public_rating}
                maxStars={5}
              />
            </div>
            <div className="flex flex-col items-center border rounded-lg py-2">
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
        <p className="text-gray-700 text-sm leading-relaxed">
          {campaign.description}
        </p>

        {/* Roles */}
        {roles.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Volunteer Roles
            </h2>
            <div className="space-y-3">
              {roles.map((role) => (
                <div key={role.id} className="p-3 border rounded-lg bg-gray-50">
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

        {/* Location Map */}
        {campaign.latitude && campaign.longitude && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Disaster Location
            </h2>
            <LocationMap
              position={[campaign.latitude, campaign.longitude]}
              label={campaign.name}
            />
          </div>
        )}

        {/* CTA */}
        <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-accent">
          Sign Up to Volunteer
        </button>
      </div>
    </div>
  );
}
