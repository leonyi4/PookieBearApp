import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase-client";
import logo from "../../assets/Vertical_logo.png";


export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const { data, error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Password updated successfully! Redirecting to login...");
    setTimeout(() => navigate("/Landing"), 2000);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 bg-cover bg-center">
      <div className="bg-background rounded-2xl shadow-lg w-full max-w-md p-6 sm:p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-40 sm:h-52 md:h-60" />
        </div>
        <h1 className="text-xl font-bold text-center text-primary mb-6">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-accent">
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="Re-enter new password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
