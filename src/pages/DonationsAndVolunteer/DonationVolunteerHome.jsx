import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";

import DonationCard from "./Donations/DonationCard";
import VolunteerCard from "./Volunteer/VolunteerCard";
import LoadingSpinner from "../../components/LoadingSpinner";

import {
  fetchDonations,
  fetchVolunteers,
  fetchOrgs,
  fetchOrgRelations,
} from "../../lib/api";

export default function DonationsVolunteersHome() {
  const { type } = useParams(); // 'donations' or 'volunteers'
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("donations");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync tab with URL
  useEffect(() => {
    if (type === "donations" || type === "volunteers") {
      setActiveTab(type);
    } else {
      navigate("/DonationsAndVolunteers/donations", { replace: true });
    }
  }, [type, navigate]);

  // Run all queries in parallel
  const results = useQueries({
    queries: [
      { queryKey: ["donations"], queryFn: fetchDonations },
      { queryKey: ["volunteers"], queryFn: fetchVolunteers },
      { queryKey: ["organizations"], queryFn: fetchOrgs },
      { queryKey: ["orgRelations"], queryFn: fetchOrgRelations },
    ],
  });

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-primary">
        <LoadingSpinner message="Fetching Donations and Volunteers..." />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Error fetching data.</p>;
  }

  // Destructure results
  const [donationsRes, volunteersRes, orgsRes, relsRes] = results;
  const donations = donationsRes.data || [];
  const volunteers = volunteersRes.data || [];
  const organizations = orgsRes.data || [];
  const { orgDonations, orgVolunteers } = relsRes.data;

  // Attach organizations
  const donationsWithOrg = donations.map((don) => {
    const rel = orgDonations?.find((od) => od.donation_id === don.id);
    const org = organizations.find((o) => o.id === rel?.org_id);
    return { ...don, organization: org || null };
  });

  const volunteersWithOrg = volunteers.map((vol) => {
    const rel = orgVolunteers?.find((ov) => ov.volunteer_id === vol.id);
    const org = organizations.find((o) => o.id === rel?.org_id);
    return { ...vol, organization: org || null };
  });

  // Filtering
  const filteredDonations = donationsWithOrg.filter((d) =>
    d.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredVolunteers = volunteersWithOrg.filter((v) =>
    v.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/DonationsAndVolunteers/${tab}`);
  };

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
              <p className="text-accent text-center w-full">
                No donations found
              </p>
            )}
          </div>

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
