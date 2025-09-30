import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useDonationById,
  useDonationContributions,
  useOrgById,
} from "../../../lib/api";
import RatingStars from "../../../components/RatingStars";
import LocationMap from "../../../components/LocationMap";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function DonationDetail() {
  const { donationId } = useParams();
  const navigate = useNavigate();

  const {
    data: campaign,
    isLoading: loadingDonation,
    error: donationError,
  } = useDonationById(donationId);

  const { data: contributions, isLoading: loadingContribs } =
    useDonationContributions(donationId);

  const { data: orgData, isLoading: loadingOrg } = useOrgById(campaign?.org_id);

  if (loadingDonation || loadingContribs || loadingOrg) {
    return (
      <div className="flex items-center justify-center h-screen text-primary">
        <LoadingSpinner message="Fetching Donation Details..." />
      </div>
    );
  }

  if (donationError || !campaign) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Donation not found.
      </div>
    );
  }

  // Progress
  const progress = Math.min(
    (campaign.raised / campaign.goal) * 100,
    100
  ).toFixed(0);

  // Budget calculation
  const total_budget = campaign.budget_allocation
    ? Object.values(campaign.budget_allocation).reduce((a, b) => a + b, 0)
    : 0;

  const budget_allocation_percentage = {};
  if (campaign.budget_allocation) {
    for (let key in campaign.budget_allocation) {
      const value = campaign.budget_allocation[key];
      const percentage = total_budget
        ? Math.round((value / total_budget) * 100)
        : 0;
      budget_allocation_percentage[key] = { percentage, value };
    }
  }

  // Format util
  const formatKey = (str) =>
    str
      ? str
          .replace(/_/g, " ")
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "";

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden lg:my-6">
      {/* Header */}
      <div className="flex items-center space-x-4 p-4 sm:p-6 border-b border-gray-200 justify-center ">
        <button
          onClick={() => navigate(-1)}
          className="text-primary text-lg hover:text-accent"
        >
          &larr;
        </button>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold uppercase text-primary text-center flex-1">
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

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-1 text-black">
            <span>
              Raised:{" "}
              <span className="font-semibold text-gray-800">
                {campaign.raised.toLocaleString()} Kyats
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
            Goal: {campaign.goal.toLocaleString()} Kyats
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          {campaign.description}
        </p>

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
            <button className="mt-4 w-full bg-primary text-white py-2 sm:py-3 rounded-lg hover:bg-accent transition">
              <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
                Donate Now
              </a>
            </button>
          </div>
        )}

        {/* Contributions */}
        {contributions?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              How Your Donation Helps
            </h2>
            <div className="space-y-3">
              {contributions.map((item) => (
                <div key={item.id} className="flex space-x-3">
                  <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center text-xl">
                    📦
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {formatKey(item.name)}
                    </p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget */}
        {total_budget > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Budget Allocation
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              Total: {total_budget.toLocaleString()} Kyats
            </p>
            <div className="space-y-2 text-black">
              {Object.entries(budget_allocation_percentage).map(
                ([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{formatKey(key)}</span>
                      <span>{value.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full"
                        style={{ width: `${value.percentage}%` }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
