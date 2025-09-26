// src/pages/DonationsAndVolunteer/DonationsVolunteersHome.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DonationCard from "./Donations/DonationCard";
import VolunteerCard from "./Volunteer/VolunteerCard";
import { supabase } from "../../lib/supabase-client";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function DonationsVolunteersHome() {
  const { type } = useParams(); // 'donations' or 'volunteers'
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("donations");
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync URL param with state
  useEffect(() => {
    if (type === "donations" || type === "volunteers") {
      setActiveTab(type);
    } else {
      navigate("/DonationsAndVolunteers/donations", { replace: true });
    }
  }, [type, navigate]);

  // Fetch donations and volunteers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: donationsData, error: donationsError } = await supabase
          .from("donations")
          .select(
            "id, name, description, goal, raised, latitude, longitude, disaster_id, image"
          );
        if (donationsError) throw donationsError;
        setDonations((donationsData || []).sort((a, b) => a.id - b.id));

        const { data: volunteersData, error: volunteersError } = await supabase
          .from("volunteers")
          .select(
            "id, name, description, latitude, longitude, disaster_id, impact, image"
          );
        if (volunteersError) throw volunteersError;
        setVolunteers((volunteersData || []).sort((a, b) => a.id - b.id));
      } catch (err) {
        console.error("Error fetching donations/volunteers:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/DonationsAndVolunteers/${tab}`);
  };

  const filteredDonations = donations.filter((d) =>
    d.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredVolunteers = volunteers.filter((v) =>
    v.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner message="Fetching Donations and Volunteers..." />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Tabs */}
      <div className="flex justify-around mb-6">
        {["donations", "volunteers"].map((tab) => (
          <button
            key={tab}
            className={`pb-2 text-lg transition ${
              activeTab === tab
                ? "font-bold border-b-2 border-primary text-primary"
                : "text-accent hover:text-primary"
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder={`Search ${activeTab}`}
        className="w-full p-3 border text-black border-secondary rounded-lg mb-6 bg-white focus:ring-2 focus:ring-primary focus:outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Donations */}
      {activeTab === "donations" && (
        <>
          {/* Horizontal scroll for mobile + medium */}
          <div className="flex flex-col space-y-4 overflow-x-auto pb-4 lg:hidden">
            {filteredDonations.length > 0 ? (
              filteredDonations.map((campaign) => (
                <DonationCard
                  key={campaign.id}
                  data={campaign}
                  home={false}
                  className="min-w-[16rem] sm:min-w-[20rem]"
                />
              ))
            ) : (
              <p className="text-accent text-center w-full">No donations found</p>
            )}
          </div>

          {/* Grid for desktop */}
          <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDonations.length > 0 ? (
              filteredDonations.map((campaign) => (
                <DonationCard key={campaign.id} data={campaign} home={false} />
              ))
            ) : (
              <p className="text-accent text-center col-span-full">
                No donations found
              </p>
            )}
          </div>
        </>
      )}

      {/* Volunteers */}
      {activeTab === "volunteers" && (
        <>
          {/* Horizontal scroll for mobile + medium */}
          <div className="flex flex-col space-y-4 overflow-x-auto pb-4 lg:hidden">
            {filteredVolunteers.length > 0 ? (
              filteredVolunteers.map((campaign) => (
                <VolunteerCard
                  key={campaign.id}
                  data={campaign}
                  home={false}
                  className="min-w-[16rem] sm:min-w-[20rem]"
                />
              ))
            ) : (
              <p className="text-accent text-center w-full">
                No volunteers found
              </p>
            )}
          </div>

          {/* Grid for desktop */}
          <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredVolunteers.length > 0 ? (
              filteredVolunteers.map((campaign) => (
                <VolunteerCard key={campaign.id} data={campaign} home={false} />
              ))
            ) : (
              <p className="text-accent text-center col-span-full">
                No volunteers found
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
