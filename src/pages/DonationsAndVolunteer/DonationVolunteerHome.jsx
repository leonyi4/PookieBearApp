import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import data from "../../assets/test_data.json";
import RatingStars from "../../components/RatingStars";

export default function DonationsVolunteersHome() {
  const { type } = useParams(); // 'donations' or 'volunteers'
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("donations");

  const donations = data.donations;
  const volunteers = data.volunteers;

  // Sync URL param with state
  useEffect(() => {
    if (type === "donations" || type === "volunteers") {
      setActiveTab(type);
    } else {
      navigate("/DonationsAndVolunteers/donations", { replace: true });
    }
  }, [type, navigate]);

  // Update URL when tab is clicked
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/DonationsAndVolunteers/${tab}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Tabs */}
      <div className="flex justify-around mb-4">
        <button
          className={`pb-2 ${
            activeTab === "donations"
              ? "font-bold border-b-2 border-primary text-primary"
              : "text-accent"
          }`}
          onClick={() => handleTabClick("donations")}
        >
          Donations
        </button>
        <button
          className={`pb-2 ${
            activeTab === "volunteers"
              ? "font-bold border-b-2 border-primary text-primary"
              : "text-accent"
          }`}
          onClick={() => handleTabClick("volunteers")}
        >
          Volunteers
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search"
        className="w-full p-2 border text-black border-secondary rounded-lg mb-4 bg-white"
      />

      {/* Donations List */}
      {activeTab === "donations" && (
        <div className="space-y-4">
          {donations.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-secondary text-black shadow rounded-lg p-4"
            >
              {/* Title & Image */}
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={campaign.image}
                  alt={campaign.name}
                  className="h-16 w-16 object-cover rounded-lg"
                />
                <div className="flex flex-col">
                  <p className="font-semibold">{campaign.name}</p>
                  <p className="text-xs text-gray-600 truncate max-w-xs">
                    {campaign.description}
                  </p>
                </div>
              </div>

              {/* Ratings */}
              <div className="flex justify-around w-full text-accent mb-3">
                <div className="flex flex-col items-center">
                  <span className="text-xs">Public Rating</span>
                  <RatingStars
                    rating={campaign.ratings?.public_rating || 4}
                    maxStars={5}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs">AI Rating</span>
                  <RatingStars
                    rating={campaign.ratings?.ai_rating || 4}
                    maxStars={5}
                  />
                </div>
              </div>

              {/* View Details */}
              <Link to={`/donations/${campaign.id}`} className="w-full">
                <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-accent">
                  View Donation
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Volunteers List */}
      {activeTab === "volunteers" && (
        <div className="space-y-4">
          {volunteers.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-secondary text-black shadow rounded-lg p-4"
            >
              {/* Title & Image */}
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={campaign.image}
                  alt={campaign.name}
                  className="h-16 w-16 object-cover rounded-lg"
                />
                <div className="flex flex-col">
                  <p className="font-semibold">{campaign.name}</p>
                  <p className="text-xs text-gray-600 truncate max-w-xs">
                    {campaign.description}
                  </p>
                </div>
              </div>

              {/* Needed vs Signed Up */}
              <div className="text-sm text-black mb-3">
                {campaign.impact.volunteers_signed_up} of{" "}
                {campaign.impact.volunteers_needed} signed up
              </div>

              {/* View Details */}
              <Link to={`/volunteers/${campaign.id}`} className="w-full">
                <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-accent">
                  View Volunteer
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
