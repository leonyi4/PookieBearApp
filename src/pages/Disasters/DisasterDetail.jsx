// src/pages/Disasters/DisasterDetail.jsx
import React, { useEffect, useState } from "react";
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

  if (loading) return <LoadingSpinner message="Loading Disaster…" />;
  if (!disaster)
    return (
      <div className="max-w-3xl mx-auto p-4">
        <p className="text-red-500">Disaster not found.</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 text-gray-900">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:text-accent text-lg"
        >
          ←
        </button>
        <h1 className="text-xl font-bold uppercase text-primary">
          {disaster.name}
        </h1>
      </div>

      {/* Card-style disaster overview */}
      <div className="bg-blue-100 rounded-xl shadow-md overflow-hidden">
        <div className="flex">
          {disaster.image && (
            <img
              src={disaster.image}
              alt={disaster.name}
              className="w-32 object-cover"
            />
          )}
          <div className="flex-1 p-3">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                {new Date(disaster.date).toLocaleDateString()}
              </p>
              <p className="text-sm font-semibold">
                Severity:{" "}
                {disaster.severity === "High" ? (
                  <span className="text-red-600">High</span>
                ) : disaster.severity === "Medium" ? (
                  <span className="text-yellow-600">Medium</span>
                ) : (
                  <span className="text-green-600">Low</span>
                )}
              </p>
            </div>
            <p className="text-sm text-gray-700 mt-2">{disaster.description}</p>
          </div>
        </div>
      </div>

      {/* Relief Operations with Tabs */}
      <div>
        <h2 className="font-semibold text-lg mb-3 text-black"> On Going Relief Operations</h2>
        <div className="flex justify-around mb-4">
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
            <div className="space-y-3">
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
            <div className="space-y-3">
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
