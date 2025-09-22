import data from "../../../assets/test_data.json";
import { useParams, useNavigate, Link } from "react-router-dom";
import RatingStars from "../../../components/RatingStars";
import LocationMap from "../../../components/LocationMap";

export default function VolunteerDetail() {
  const { volunteerId } = useParams();
  const navigate = useNavigate();

  // Get Volunteer Campaign Data
  const campaign = data.volunteers.find((v) => v.id === parseInt(volunteerId));

  // Get Organization Data
  const org = campaign["org_id"];
  const orgData = data.orgs.find((o) => o.id === org);

  // Impact calculation
  const progress = Math.min(
    (campaign.impact.volunteers_signed_up / campaign.impact.volunteers_needed) *
      100,
    100
  ).toFixed(0);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Back Button and Title */}
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
      <img
        src={campaign.image}
        alt={campaign.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-6 space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>

        {/* Organization Info */}
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
            <p className="text-xs text-gray-500">{orgData.tags}</p>
          </div>
        </div>

        {/* Ratings */}
        <div className="grid grid-cols-2 gap-3 text-accent">
          <button className="flex flex-col space-y-2 items-center justify-center border rounded-lg py-2">
            <span className="text-sm font-medium">Public Rating</span>
            <RatingStars rating={orgData.ratings.public_rating} maxStars={5} />
          </button>
          <button className="flex flex-col space-y-2 items-center justify-center border rounded-lg py-2">
            <span className="text-sm font-medium">AI Rating</span>
            <RatingStars rating={orgData.ratings.ai_rating} maxStars={5} />
          </button>
        </div>

        {/* Volunteer Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1 text-black">
            <span>
              Signed Up:{" "}
              <span className="font-semibold text-gray-800">
                {campaign.impact.volunteers_signed_up}
              </span>
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
            Needed: {campaign.impact.volunteers_needed}
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm leading-relaxed">
          {campaign.description}
        </p>

        {/* Roles Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Volunteer Roles
          </h2>
          <div className="space-y-3">
            {campaign.roles.map((role) => (
              <div
                key={role.role_id}
                className="p-3 border rounded-lg bg-gray-50"
              >
                <p className="font-medium text-gray-800">{role.title}</p>
                <p className="text-sm text-gray-600">
                  Commitment: {role.commitment}
                </p>
                <p className="text-xs text-gray-500">
                  Skills: {role.skills_required.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Location Map */}
        <div className="">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Disaster Location
          </h2>
          <LocationMap
            position={[campaign.location_data.latitude, campaign.location_data.longitude]} // e.g., [16.8409, 96.1735]
            label={campaign.name}
          />
        </div>

        {/* CTA */}
        <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-accent">
          Sign Up to Volunteer
        </button>
      </div>
    </div>
  );
}
