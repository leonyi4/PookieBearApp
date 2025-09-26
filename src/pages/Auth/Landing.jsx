import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase-client";
import logo from "../../assets/Vertical_logo.png";

export default function Landing() {
  const navigate = useNavigate();
  const { user, login, loading } = useAuth(); // from AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // If already logged in, route away from Landing immediately
  useEffect(() => {
    const routeIfLoggedIn = async () => {
      if (!user) return;
      // fetch profile_complete; if no row, treat as incomplete
      const { data: profile, error: profileErr } = await supabase
        .from("users")
        .select("profile_complete")
        .eq("id", user.id)
        .single();

      // console.log(profile)
      if (profileErr || !profile || profile.profile_complete === false) {
        navigate("/ProfileCompletion", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    };
    if (!loading) routeIfLoggedIn();
  }, [user, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const authedUser = await login(email, password); // AuthContext → supabase.auth.signInWithPassword
      if (!authedUser) return;

      // Make sure a minimal users row exists (if signup minimal insert ever failed)
      const { data: profile, error: fetchErr } = await supabase
        .from("users")
        .select("profile_complete")
        .eq("id", authedUser.id)
        .single();

      if (fetchErr || !profile) {
        // Try to create minimal row (id+email); ignore unique conflicts
        await supabase.from("users").insert({
          id: authedUser.id,
          email,
          profile_complete: false,
        });
        return navigate("/ProfileCompletion");
      }

      // Route by completion
      if (!profile.profile_complete) {
        navigate("/ProfileCompletion");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
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
            src={logo}
            alt="Pookie Bear Logo"
            className="h-40 sm:h-52 md:h-60"
          />
        </div>

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

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            Log In
          </button>

          <button
            type="button"
            onClick={() => navigate("/SignUp")}
            className="w-full bg-secondary text-accent py-3 rounded-lg font-semibold hover:bg-opacity-80 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-4">
          <button className="text-sm text-gray-600 hover:text-primary">
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}
