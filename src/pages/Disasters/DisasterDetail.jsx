import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase-client";
import LoadingSpinner from "../../components/LoadingSpinner";
import LocationMap from "../../components/LocationMap";
import DonationCard from "../DonationsAndVolunteer/Donations/DonationCard";
import VolunteerCard from "../DonationsAndVolunteer/Volunteer/VolunteerCard";

const DisasterDetail = () => {
  const { disasterId } = useParams();
  const navigate = useNavigate();

  const [disaster, setDisaster] = useState(null);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [activeTab, setActiveTab] = useState("donations");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisasterDetails = async () => {
      try {
        setLoading(true);

        // 1. Disaster
        const { data: disasterData, error: disasterError } = await supabase
          .from("disasters")
          .select("*")
          .eq("id", disasterId)
          .single();
        if (disasterError) throw disasterError;
        setDisaster(disasterData);

        // 2. Donations linked
        const { data: donationLinks } = await supabase
          .from("disaster_donations")
          .select("donation_id")
          .eq("disaster_id", disasterId);

        if (donationLinks?.length) {
          const donationIds = donationLinks.map((d) => d.donation_id);
          const { data: donationData } = await supabase
            .from("donations")
            .select("*")
            .in("id", donationIds);
          setDonations(donationData || []);
        }

        // 3. Volunteers linked
        const { data: volunteerLinks } = await supabase
          .from("disaster_volunteers")
          .select("volunteers_id")
          .eq("disaster_id", disasterId);

        if (volunteerLinks?.length) {
          const volunteerIds = volunteerLinks.map((v) => v.volunteers_id);
          const { data: volunteerData } = await supabase
            .from("volunteers")
            .select("*")
            .in("id", volunteerIds);
          setVolunteers(volunteerData || []);
        }
      } catch (err) {
        console.error("Error fetching disaster details:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDisasterDetails();
  }, [disasterId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-primary">
        <LoadingSpinner message="Loading Disaster…" />
      </div>
    );
  if (!disaster)
    return (
      <div className="max-w-3xl mx-auto p-4">
        <p className="text-red-500">Disaster not found.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 text-gray-900">
      {/* Header */}
      <div className="flex items-center space-x-4 justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:text-accent text-lg"
        >
          ←
        </button>
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold uppercase text-primary flex-1 text-center">
          {disaster.name}
        </h1>
      </div>

      {/* Disaster Information */}
      <div className="flex flex-col sm:flex-row gap-4 items-start bg-background">
        {/* Image */}
        {disaster.image && (
          <img
            src={disaster.image}
            alt={disaster.name}
            className="w-full sm:w-56 h-40 sm:h-48 object-cover rounded-lg border"
          />
        )}

        {/* Info */}
        <div className="flex-1 space-y-2">
          {/* <h2 className="text-2xl font-bold text-primary uppercase">
            {disaster.name}
          </h2> */}
          <div className="flex justify-between">
            <p className="text-sm text-gray-500 w-fit">
              Date: {new Date(disaster.date).toLocaleDateString()}
            </p>
            <span
              className={` px-3 py-1 text-xs font-semibold rounded-full 
        ${
          disaster.severity === "High"
            ? "bg-red-100 text-red-700"
            : disaster.severity === "Moderate"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }`}
            >
              Severity: {disaster.severity}
            </span>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed">
            {disaster.description}
          </p>
        </div>
      </div>

      {/* Relief Operations */}
      <div>
        <h2 className="font-semibold text-lg mb-3 text-black">
          On Going Relief Operations
        </h2>
        <div className="flex justify-around mb-4 text-sm sm:text-base">
          <button
            className={`pb-2 ${
              activeTab === "donations"
                ? "font-bold border-b-2 border-primary text-primary"
                : "text-accent"
            }`}
            onClick={() => setActiveTab("donations")}
          >
            Donations
          </button>
          <button
            className={`pb-2 ${
              activeTab === "volunteers"
                ? "font-bold border-b-2 border-primary text-primary"
                : "text-accent"
            }`}
            onClick={() => setActiveTab("volunteers")}
          >
            Volunteers
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "donations" ? (
          donations.length > 0 ? (
            <div className="grid grid-flow-col auto-cols-[85%] sm:auto-cols-[45%] md:auto-cols-[35%] overflow-x-auto gap-4 pb-2">
              {donations.map((donation) => (
                <DonationCard key={donation.id} data={donation} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              No donation campaigns for this disaster.
            </p>
          )
        ) : activeTab === "volunteers" ? (
          volunteers.length > 0 ? (
            <div className="grid grid-flow-col auto-cols-[85%] sm:auto-cols-[45%] md:auto-cols-[35%] overflow-x-auto gap-4 pb-2">
              {volunteers.map((vol) => (
                <VolunteerCard key={vol.id} data={vol} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              No volunteer campaigns for this disaster.
            </p>
          )
        ) : null}
      </div>
    </div>
  );
};

export default DisasterDetail;
