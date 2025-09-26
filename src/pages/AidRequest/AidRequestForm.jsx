// src/pages/AidRequest/AidRequestForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase-client";
import { useAuth } from "../../context/AuthContext";

export default function AidRequestForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "",
    severity: "",
    needs: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to make a request.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("aid_requests").insert({
      user_id: user.id,
      type: formData.type,
      severity: formData.severity,
      needs: formData.needs,
      location: formData.location,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Error submitting aid request");
      return;
    }

    alert("Aid request submitted successfully!");
    navigate("/");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4 bg-background">
      <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6">
        <h1 className="text-xl font-bold text-center text-primary mb-4">
          Request Aid
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3 text-accent">
          <input
            id="type"
            type="text"
            placeholder="Type of Emergency"
            className="w-full p-3 border rounded-lg text-black"
            value={formData.type}
            onChange={handleChange}
            required
          />
          <select
            id="severity"
            className="w-full p-3 border rounded-lg text-black"
            value={formData.severity}
            onChange={handleChange}
            required
          >
            <option value="">Select Severity</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <textarea
            id="needs"
            placeholder="What do you need?"
            className="w-full p-3 border rounded-lg text-black"
            rows="3"
            value={formData.needs}
            onChange={handleChange}
            required
          />
          <input
            id="location"
            type="text"
            placeholder="Your Current Location"
            className="w-full p-3 border rounded-lg text-black"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
