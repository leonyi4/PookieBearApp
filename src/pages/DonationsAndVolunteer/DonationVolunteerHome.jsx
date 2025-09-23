import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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

        // Fetch donations
        const { data: donationsData, error: donationsError } = await supabase
          .from("donations")
          .select(
            "id, name, description, goal, raised, latitude, longitude, disaster_id, image"
          );

        if (donationsError) throw donationsError;

        const sortedDonations = (donationsData || []).sort(
          (a, b) => a.id - b.id
        );
        setDonations(sortedDonations);

        // Fetch volunteers
        const { data: volunteersData, error: volunteersError } = await supabase
          .from("volunteers")
          .select(
            "id, name, description, latitude, longitude, disaster_id, impact, image"
          );

        if (volunteersError) throw volunteersError;
        const sortedVolunteers = (volunteersData || []).sort(
          (a, b) => a.id - b.id
        );
        setVolunteers(sortedVolunteers);
      } catch (err) {
        console.error("Error fetching donations/volunteers:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update URL when tab is clicked
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/DonationsAndVolunteers/${tab}`);
  };

  // Filter logic
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
        placeholder={`Search ${activeTab}`}
        className="w-full p-2 border text-black border-secondary rounded-lg mb-4 bg-white"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Donations List */}
      {activeTab === "donations" && (
        <div className="space-y-4">
          {filteredDonations.length > 0 ? (
            filteredDonations.map((campaign) => (
              <DonationCard key={campaign.id} data={campaign} home={false} />
            ))
          ) : (
            <p className="text-accent text-center">No donations found</p>
          )}
        </div>
      )}

      {/* Volunteers List */}
      {activeTab === "volunteers" && (
        <div className="space-y-4">
          {filteredVolunteers.length > 0 ? (
            filteredVolunteers.map((campaign) => (
              <VolunteerCard key={campaign.id} data={campaign} home={false} />
            ))
          ) : (
            <p className="text-accent text-center">No volunteers found</p>
          )}
        </div>
      )}
    </div>
  );
}
