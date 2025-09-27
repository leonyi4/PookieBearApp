// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AidRequestCard from "../pages/AidRequest/AidRequestCard";
import { supabase } from "../lib/supabase-client";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [aidRequests, setAidRequests] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [dataLoading, setDataLoading] = useState(true); // ✅ new loading state

  // Switch tab if navigation state includes one
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // Fetch profile + related data
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/Landing", { replace: true });

    const loadData = async () => {
      setDataLoading(true);

      // Profile
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select(
          "name, identification, birthdate, country, city, phone, latitude, longitude, profile_picture, age, gender"
        )
        .eq("id", user.id)
        .single();

      if (profileError) {
        setFetchError(profileError.message);
      } else {
        setProfile(profileData);
      }

      // Aid Requests
      const { data: requests } = await supabase
        .from("aid_requests")
        .select(
          `
          *,
          organizations (
            id,
            name,
            logo
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setAidRequests(requests || []);

      // Contributions
      const { data: contribs } = await supabase
        .from("user_contributions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setContributions(contribs || []);

      setDataLoading(false); // ✅ finished loading
    };

    loadData();
  }, [user, loading, navigate]);

  // Loading screen
  if (loading || dataLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-primary">
        <LoadingSpinner message='Loading Profile' />
      </div>
    );
  }

  // Error / not found
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{fetchError || "Profile not found."}</p>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 w-full max-w-5xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-primary text-lg hover:text-accent mr-3"
          >
            &larr;
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            My Profile
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 border-b border-secondary pb-2 mb-6">
          {["profile", "aid", "contributions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 transition ${
                activeTab === tab
                  ? "font-bold border-b-2 border-primary text-primary"
                  : "text-accent hover:text-primary"
              }`}
            >
              {tab === "profile"
                ? "Profile"
                : tab === "aid"
                ? "Aid Requests"
                : "Contributions"}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div>
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <img
                src={profile.profile_picture || "/default-profile.png"}
                alt="Profile"
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary"
              />
              <div className="text-center md:text-left">
                <p className="text-xl font-semibold text-gray-900">
                  {profile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {profile.identification || "N/A"}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Birthdate</p>
                <p className="text-gray-900">{profile.birthdate || "-"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Age</p>
                <p className="text-gray-900">{profile.age || "-"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Gender</p>
                <p className="text-gray-900">{profile.gender || "-"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Phone</p>
                <p className="text-gray-900">{profile.phone || "-"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Country</p>
                <p className="text-gray-900">{profile.country || "-"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">City</p>
                <p className="text-gray-900">{profile.city || "-"}</p>
              </div>
            </div>

            {/* Customize Button */}
            <div className="mt-6">
              <Link to="/CustomizeProfile">
                <button className="w-full md:w-auto px-6 py-2 bg-primary hover:bg-accent text-white font-medium rounded-lg transition">
                  Customize Profile
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Aid Requests Tab */}
        {activeTab === "aid" && (
          <div>
            <h2 className="font-semibold text-lg text-primary mb-3">
              Your Aid Requests
            </h2>
            {aidRequests.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {aidRequests.map((req) => (
                  <AidRequestCard key={req.id} request={req} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">
                You haven’t made any aid requests yet.
              </p>
            )}
          </div>
        )}

        {/* Contributions Tab */}
        {activeTab === "contributions" && (
          <div>
            <h2 className="font-semibold text-lg text-primary mb-3">
              Your Contributions
            </h2>
            {contributions.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {contributions.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 border rounded-lg bg-secondary/20 shadow-sm hover:shadow-md transition"
                  >
                    <p className="font-medium text-accent">
                      {c.type === "donation"
                        ? `Donation: ${c.amount} Kyats`
                        : `Volunteered for ${c.campaign_name}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(c.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">
                You haven’t made any contributions yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
