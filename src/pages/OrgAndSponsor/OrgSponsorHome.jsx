import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";

import { fetchOrgs, fetchSponsors } from "../../lib/api";

import RatingStars from "../../components/RatingStars";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function OrgSponsorsHome() {
  const { type } = useParams(); // 'organizations' or 'sponsors'
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("organizations");
  const [searchTerm, setSearchTerm] = useState("");

  // Sync URL param with state
  useEffect(() => {
    if (type === "organizations" || type === "sponsors") {
      setActiveTab(type);
    } else {
      navigate("/OrgsAndSponsors/organizations", { replace: true });
    }
  }, [type, navigate]);

  const results = useQueries({
    queries: [
      { queryKey: ["organizations"], queryFn: fetchOrgs },
      { queryKey: ["sponsors"], queryFn: fetchSponsors },
    ],
  });

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-primary">
        <LoadingSpinner message="Fetching Organizations and Sponsors..." />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Error fetching data.</p>;
  }

  const [orgsRes, sponsorsRes] = results;
  const organizations = orgsRes.data || [];
  const sponsors = sponsorsRes.data || [];

  // Update URL when tab is clicked
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/OrgsAndSponsors/${tab}`);
  };

  // Filter results
  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredSponsors = sponsors.filter((sponsor) =>
    sponsor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Tabs */}
      <div className="flex justify-around border-b border-gray-200 mb-4">
        <button
          className={`pb-2 transition ${
            activeTab === "organizations"
              ? "font-bold border-b-2 border-primary text-primary"
              : "text-accent hover:text-primary"
          }`}
          onClick={() => handleTabClick("organizations")}
        >
          Organizations
        </button>
        <button
          className={`pb-2 transition ${
            activeTab === "sponsors"
              ? "font-bold border-b-2 border-primary text-primary"
              : "text-accent hover:text-primary"
          }`}
          onClick={() => handleTabClick("sponsors")}
        >
          Sponsors
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder={`Search ${activeTab}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-secondary rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Organizations List */}
      {activeTab === "organizations" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.length > 0 ? (
            filteredOrganizations.map((org) => (
              <div
                key={org.id}
                className="bg-secondary rounded-xl shadow-md hover:shadow-lg transition flex flex-col p-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={org.logo}
                    alt={org.name}
                    className="h-14 w-14 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{org.name}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {org.description}
                    </p>
                  </div>
                </div>

                <div className="flex justify-around mt-4 text-accent text-center">
                  <div className="flex flex-col items-center bg-background rounded-lg p-2 shadow-sm w-1/2 mx-1">
                    <span className="text-xs font-medium">Public Rating</span>
                    <RatingStars
                      rating={org.ratings?.public_rating}
                      maxStars={5}
                    />
                  </div>
                  <div className="flex flex-col items-center bg-background rounded-lg p-2 shadow-sm w-1/2 mx-1">
                    <span className="text-xs font-medium">AI Rating</span>
                    <RatingStars rating={org.ratings?.ai_rating} maxStars={5} />
                  </div>
                </div>

                <Link
                  to={`/OrgsAndSponsors/organizations/${org.id}`}
                  className="mt-4"
                >
                  <button className="w-full bg-primary text-white font-medium py-2 rounded-lg hover:bg-accent transition">
                    View Details
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No organizations found.
            </p>
          )}
        </div>
      )}

      {/* Sponsors List */}
      {activeTab === "sponsors" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-center">
          {filteredSponsors.length > 0 ? (
            filteredSponsors.map((sponsor) => (
              <Link
                to={`/OrgsAndSponsors/sponsors/${sponsor.id}`}
                key={sponsor.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center p-4"
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="h-16 w-16 object-contain mb-2"
                />
                <p className="text-sm font-semibold text-gray-800 text-center uppercase">
                  {sponsor.name}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No sponsors found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
