import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../lib/supabase-client";
import RatingStars from "../../../components/RatingStars";
import LocationMap from "../../../components/LocationMap";

export default function DonationDetail() {
  const { donationId } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [orgData, setOrgData] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        setLoading(true);

        // 1. Fetch donation details
        const { data: donation, error } = await supabase
          .from("donations")
          .select(
            `
            id,
            name,
            description,
            goal,
            raised,
            image,
            budget_allocation,
            org_id,
            latitude,
            longitude,
            disaster_id
          `
          )
          .eq("id", donationId)
          .single();

        if (error) throw error;
        setCampaign(donation);

        // 2. Fetch organization details
        if (donation.org_id) {
          const { data: org, error: orgError } = await supabase
            .from("organizations")
            .select("id, name, logo, tags, ratings")
            .eq("id", donation.org_id)
            .single();

          if (orgError) throw orgError;
          setOrgData(org);
        }

        // 3. Fetch contributions linked to this donation
        const { data: contribs, error: contribError } = await supabase
          .from("donation_contributions")
          .select(
            `
            contributions (
              id,
              name,
              description
            )
          `
          )
          .eq("donation_id", donationId);

        if (contribError) throw contribError;

        // Flatten the nested contributions array
        const contribList = contribs.map((c) => c.contributions);
        setContributions(contribList || []);
      } catch (err) {
        console.error("Error fetching donation detail:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [donationId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-accent">
        Loading…
      </div>
    );
  }

  if (!campaign) {
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

  // Budget allocation calculations
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
      <img
        src={campaign.image}
        alt={campaign.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-6 space-y-6">
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
        <p className="text-gray-700 text-sm leading-relaxed">
          {campaign.description}
        </p>

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
          Donate Now
        </button>

        {/* Contributions */}
        {contributions.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              How Your Donation Helps
            </h2>
            <div className="space-y-3">
              {contributions.map((item) => (
                <div key={item.id} className="flex space-x-3">
                  <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                    📦
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget Allocation */}
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
                      <span>{key}</span>
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
