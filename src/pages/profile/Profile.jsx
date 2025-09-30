import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AidRequestCard from "../AidRequest/AidRequestCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  useUserProfile,
  useUserAidRequests,
  useUserContributions,
} from "../../lib/api";
import { useState, useEffect } from "react";

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile(user?.id);

  const {
    data: aidRequests = [],
    isLoading: aidLoading,
  } = useUserAidRequests(user?.id);

  const {
    data: contributions = [],
    isLoading: contribLoading,
  } = useUserContributions(user?.id);

  if (loading || profileLoading || aidLoading || contribLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-primary">
        <LoadingSpinner message="Loading Profile" />
      </div>
    );
  }

  if (!user) return navigate("/Landing", { replace: true });

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">
          {profileError?.message || "Profile not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-primary text-lg hover:text-accent mr-3"
          >
            &larr;
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-primary text-center flex-1">
            My Profile
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 border-b border-t py-2 md:py-0 md:border-t-0 border-secondary pb-0 mb-6">
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

        {/* Tabs Content */}
        {activeTab === "profile" && (
          <div>
            {/* Profile header */}
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

            {/* Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                ["Birthdate", profile.birthdate],
                ["Age", profile.age],
                ["Gender", profile.gender],
                ["Phone", profile.phone],
                ["Country", profile.country],
                ["City", profile.city],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="font-medium text-gray-700">{label}</p>
                  <p className="text-gray-900">{value || "-"}</p>
                </div>
              ))}
            </div>

            {/* Customize button */}
            <div className="mt-6">
              <Link to="/CustomizeProfile">
                <button className="w-full md:w-auto px-6 py-2 bg-primary hover:bg-accent text-white font-medium rounded-lg transition">
                  Customize Profile
                </button>
              </Link>
            </div>
          </div>
        )}

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
