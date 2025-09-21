import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import data from "../../assets/test_data.json";
import logo from "../../assets/Vertical_logo.png";

const users = data.users; // mock users from test_data.json


export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Check against mock users
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      login(foundUser); // Save to context + localStorage
      navigate("/"); // Redirect to home page
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-cover bg-center"
         style={{ backgroundImage: "url('/map-background.png')" }}>
      <div className="bg-background p-8 rounded-2xl shadow-lg w-[90%] max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Pookie Bear Logo" className="h-60" />
        </div>

        {/* Auth Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-accent">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-sky-700 transition"
          >
            Log In
          </button>

          <button
            type="button"
            onClick={() => navigate("/SignUp")}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
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
