import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../../lib/api";
import { supabase } from "../../lib/supabase-client"; // only for reset flow if you keep it here

export default function Landing() {
  const navigate = useNavigate();
  const { user, login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  // Profile query (only runs when user exists)
  const {
    data: profile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: () => fetchUserProfile(user.id),
    enabled: !!user, // don't run if not logged in
    staleTime: 1000 * 60, // 1 minute cache
  });

  // Redirect when we know the profile state
  useEffect(() => {
    if (loading) return; // waiting for auth to initialize
    if (!user) return; // user not logged in → stay on Landing

    if (profileLoading) return; // profile is being fetched

    // If profile row doesn't exist or profile_complete is false → complete profile
    if (!profile || profile.profile_complete === false) {
      navigate("/ProfileCompletion", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [loading, user, profileLoading, profile, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingAction(true);
    try {
      await login(email, password); // profile query will run & redirect
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoadingAction(true);

    if (!email) {
      setError("Please enter your email address");
      setLoadingAction(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/ResetPassword`,
    });

    if (error) setError(error.message);
    else setMessage("Check your email for the reset link.");

    setLoadingAction(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-accent">
        Loading…
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/map-background.png')" }}
    >
      <div className="bg-background p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md md:max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/Vertical_logo.png"
            alt="Logo"
            className="h-40 sm:h-52 md:h-60"
          />
        </div>

        {!resetMode ? (
          <form onSubmit={handleLogin} className="space-y-4 text-accent">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg text-accent focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg text-accent focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {loadingAction && (
              <div className="flex flex-col items-center justify-center py-2">
                <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-xs sm:text-sm animate-pulse">
                  Logging in...
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 active:bg-accent transition"
            >
              Log In
            </button>

            <button
              type="button"
              onClick={() => navigate("/SignUp")}
              className="w-full bg-secondary text-accent py-3 rounded-lg font-semibold hover:bg-opacity-80 active:bg-primary transition"
            >
              Sign Up
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setResetMode(true)}
                className="text-sm text-gray-600 hover:text-primary"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleResetPassword}
            className="space-y-4 text-accent"
          >
            <label className="text-xs sm:text-sm md:text-md font-medium">
              Enter Your Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg text-accent focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {loadingAction && (
              <div className="flex flex-col items-center justify-center py-2">
                <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-xs sm:text-sm animate-pulse">
                  Resetting Password...
                </p>
              </div>
            )}
            {message && <p className="text-green-600 text-sm">{message}</p>}

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 active:bg-accent transition"
            >
              Send Reset Link
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setResetMode(false)}
                className="text-sm text-gray-600 hover:text-primary"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
