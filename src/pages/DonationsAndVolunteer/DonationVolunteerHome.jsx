import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import data from "../../assets/test_data.json";
import RatingStars from "../../components/RatingStars";
import DonationCard from "./Donations/DonationCard";
import VolunteerCard from "./Volunteer/VolunteerCard";

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
        <div className="space-y-4 ">
          {donations.map((campaign) => (
            <DonationCard key={campaign.id} data={campaign} home={false} />
          ))}
        </div>
      )}

      {/* Volunteers List */}
      {activeTab === "volunteers" && (
        <div className="space-y-4">
          {volunteers.map((campaign) => (
            <VolunteerCard key={campaign.id} data={campaign} home={false} />
          ))}
        </div>
      )}
    </div>
  );
}
