import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase-client";
import RatingStars from "../../components/RatingStars";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function OrgSponsorsHome() {
  const { type } = useParams(); // 'organizations' or 'sponsors'
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("organizations");
  const [organizations, setOrganizations] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch orgs + sponsors
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: orgs, error: orgError } = await supabase
          .from("organizations")
          .select("id, name, description, logo, tags, ratings");

        if (orgError) throw orgError;
        setOrganizations(orgs || []);

        const { data: sponsorData, error: sponsorError } = await supabase
          .from("sponsors")
          .select("id, name, logo");

        if (sponsorError) throw sponsorError;
        setSponsors(sponsorData || []);
      } catch (err) {
        console.error("Error fetching orgs/sponsors:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sync URL param with state
  useEffect(() => {
    if (type === "organizations" || type === "sponsors") {
      setActiveTab(type);
    } else {
      // Redirect to default if invalid param
      navigate("/OrgsAndSponsors/organizations", { replace: true });
    }
  }, [type, navigate]);

  // Update URL when tab is clicked
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // console.log("tab: ", tab);
    navigate(`/OrgsAndSponsors/${tab}`);
  };

  if (loading) {
    return <LoadingSpinner message="Fetching Organizations and Sponsors..." />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Tabs */}
      <div className="flex justify-around  mb-4">
        <button
          className={`pb-2 ${
            activeTab === "organizations"
              ? "font-bold border-b-2 border-primary text-primary"
              : "text-accent"
          }`}
          onClick={() => handleTabClick("organizations")}
        >
          Organizations
        </button>
        <button
          className={`pb-2 ${
            activeTab === "sponsors"
              ? "font-bold border-b-2 border-primary text-primary"
              : "text-accent"
          }`}
          onClick={() => handleTabClick("sponsors")}
        >
          Sponsors
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search"
        className="w-full p-2 border text-black border-secondary rounded-lg mb-4 bg-white"
      ></input>

      {/* Organizations List */}
      {activeTab === "organizations" && (
        <div className="space-y-4">
          {organizations.map((org, idx) => (
            <div
              key={idx}
              className="text-black bg-secondary shadow rounded-lg p-2 flex flex-col
               justify-between items-center"
            >
              <div className="flex items-center space-x-3 my-2 w-full ">
                <img
                  src={org.logo}
                  alt={org.name}
                  className="max-h-25 max-w-50 rounded-full"
                />
                <div className="flex flex-col max-h-full min-h-full">
                  <p className="font-semibold h-12 items-center flex align-middle">
                    {org.name}
                  </p>
                  <p className="text-sm text-black max-h-13 overflow-auto">
                    {org.description}
                  </p>
                </div>
              </div>
              <div className="flex justify-around w-full text-accent ">
                <button className="flex flex-col p-2 bg-background space-y-2 items-center justify-center space-x-1 border rounded-lg py-2">
                  <span className="text-sm font-medium">Public Rating</span>
                  <RatingStars
                    rating={org.ratings.public_rating}
                    maxStars={5}
                    className=""
                  />
                </button>
                <button className="flex p-2 bg-background flex-col space-y-2 items-center justify-center space-x-1 border rounded-lg py-2">
                  <span className="text-sm font-medium ">AI Rating</span>
                  <RatingStars
                    rating={org.ratings.ai_rating}
                    maxStars={5}
                    className=""
                  />
                </button>
              </div>
              {/* View Details */}
              <Link
                to={`/OrgsAndSponsors/organizations/${org.id}`}
                className="w-full"
              >
                <button className="mt-4 w-full bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700">
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Sponsors List */}
      {activeTab === "sponsors" && (
        <div className="flex flex-wrap gap-4 justify-center">
          {sponsors.map((sponsor, idx) => (
            <Link
              to={`/OrgsAndSponsors/sponsors/${sponsor.id}`}
              key={idx}
              className="bg-white text-black shadow  rounded-lg p-4 flex flex-col items-center w-32"
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-16 w-16 object-contain mb-2"
              />
              <p className="text-sm text-center font-semibold uppercase">
                {sponsor.name}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
