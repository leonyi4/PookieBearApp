import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchVolunteerById,
  fetchOrgById,
  fetchVolunteerRoles,
} from "../../../lib/api";
import RatingStars from "../../../components/RatingStars";
import LocationMap from "../../../components/LocationMap";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function VolunteerDetail() {
  const { volunteerId } = useParams();
  const navigate = useNavigate();

  // Volunteer
  const {
    data: campaign,
    isLoading: loadingVolunteer,
    error: volunteerError,
  } = useQuery({
    queryKey: ["volunteer", volunteerId],
    queryFn: () => fetchVolunteerById(volunteerId),
    enabled: !!volunteerId,
  });

  // Org
  const { data: orgData, isLoading: loadingOrg } = useQuery({
    queryKey: ["org", campaign?.org_id],
    queryFn: () => fetchOrgById(campaign.org_id),
    enabled: !!campaign?.org_id,
  });

  // Roles
  const { data: roles, isLoading: loadingRoles } = useQuery({
    queryKey: ["volunteerRoles", volunteerId],
    queryFn: () => fetchVolunteerRoles(volunteerId),
    enabled: !!volunteerId,
  });

  if (loadingVolunteer || loadingOrg || loadingRoles) {
    return <LoadingSpinner message="Fetching Volunteer Details..." />;
  }

  if (volunteerError || !campaign) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Volunteer opportunity not found.
      </div>
    );
  }

  const signedUp = campaign.impact?.volunteers_signed_up ?? 0;
  const needed = campaign.impact?.volunteers_needed ?? 0;
  const progress = needed
    ? Math.min((signedUp / needed) * 100, 100).toFixed(0)
    : 0;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden lg:my-6">
      {/* Header */}
      <div className="flex items-center space-x-4 p-4 sm:p-6 border-b border-gray-200 justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-primary text-lg hover:text-accent md:text-xl"
        >
          &larr;
        </button>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold uppercase text-primary flex-1 text-center">
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
          <div className="flex items-center lg:space-x-3">
            <img
              src={orgData.logo}
              alt={orgData.name}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full"
            />
            <div>
              <Link to={`/OrgsAndSponsors/organizations/${orgData.id}`}>
                <p className="font-medium text-gray-800">{orgData.name} ⓘ</p>
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
          <p className="text-sm text-gray-500 mt-1">
            Needed: {needed} volunteers
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          {campaign.description}
        </p>

        {/* Roles */}
        {roles?.length > 0 && (
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
                disaster_id={campaign.disaster_id}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <button className="w-full bg-primary text-white py-2 sm:py-3 rounded-lg hover:bg-accent transition">
          <a href="https://youtu.be/dQw4w9WgXcQ?si=sA3QwFW9WSFnnCzR">
            Sign Up to Volunteer
          </a>
        </button>
      </div>
    </div>
  );
}
