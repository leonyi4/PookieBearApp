// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AidRequestCard from "../pages/AidRequest/AidRequestCard";
import { supabase } from "../lib/supabase-client";

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [aidRequests, setAidRequests] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/Landing", { replace: true });

    const loadData = async () => {
      // Profile
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select(
          "name, identification, birthdate, country, city, phone, latitude, longitude, profile_picture"
        )
        .eq("id", user.id)
        .single();

      if (profileError) return setFetchError(profileError.message);
      setProfile(profileData);

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

        console.log(requests)

      // Contributions (donations/volunteering)
      const { data: contribs } = await supabase
        .from("user_contributions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setContributions(contribs || []);
    };

    loadData();
  }, [user, loading, navigate]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-primary">
        Loading…
      </div>
    );

  if (!profile)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{fetchError || "Profile not found."}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-3xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-primary text-lg hover:text-accent mr-3"
          >
            &larr;
          </button>
          <h1 className="text-2xl font-bold text-primary">My Profile</h1>
        </div>

        {/* Tabs */}
        <div className="flex justify-around mb-6">
          {["profile", "aid", "contributions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${
                activeTab === tab
                  ? "font-bold border-b-2 border-primary text-primary"
                  : "text-accent"
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
            <div className="flex flex-col items-center space-y-4">
              <img
                src={profile.profile_picture || "/default-profile.png"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-2 border-primary"
              />
              <p className="text-lg font-semibold text-gray-900">
                {profile.name}
              </p>
              <p className="text-sm text-gray-500">
                {profile.identification || "N/A"}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Birthdate</p>
                <p className="text-gray-900">{profile.birthdate || "-"}</p>
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
                <button className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg">
                  Customize Profile
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Aid Requests Tab */}
        {activeTab === "aid" && (
          <div>
            <h2 className="font-semibold mb-3">Your Aid Requests</h2>
            {aidRequests.length > 0 ? (
              <div className="space-y-3">
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
            <h2 className="font-semibold mb-3">Your Contributions</h2>
            {contributions.length > 0 ? (
              <div className="space-y-3">
                {contributions.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 border rounded-lg bg-gray-50 shadow"
                  >
                    <p className="font-medium text-gray-900">
                      {c.type === "donation"
                        ? `Donation: ${c.amount} Kyats`
                        : `Volunteered for ${c.campaign_name}`}
                    </p>
                    <p className="text-xs text-gray-500">
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
