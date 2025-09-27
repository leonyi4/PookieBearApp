import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase-client";
import { useAuth } from "../../context/AuthContext";
import LocationPicker from "../../components/LocationPicker";

export default function AidRequestForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    disaster_type: "",
    severity: "",
    aid_types: [],
    latitude: "",
    longitude: "",
  });

  const [tempLocation, setTempLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [errors, setErrors] = useState({});

  const disasterOptions = ["Earthquake", "Fire", "Flood", "Other"];
  const severityOptions = ["Low", "Moderate", "High", "Critical"];
  const aidOptions = [
    "Food",
    "Water",
    "Shelter",
    "Medical",
    "Evacuation",
    "Money",
    "Other",
  ];

  const toggleAidType = (type) => {
    setFormData((prev) => {
      const exists = prev.aid_types.includes(type);
      return {
        ...prev,
        aid_types: exists
          ? prev.aid_types.filter((t) => t !== type)
          : [...prev.aid_types, type],
      };
    });
  };

  const handleConfirmLocation = () => {
    if (!tempLocation) {
      setErrors((prev) => ({
        ...prev,
        location: "Please select a location first.",
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      latitude: tempLocation.lat,
      longitude: tempLocation.lng,
    }));
    setLocationConfirmed(true);
    setErrors((prev) => ({ ...prev, location: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.disaster_type)
      newErrors.disaster_type = "Emergency type is required.";
    if (!formData.severity) newErrors.severity = "Severity is required.";
    if (formData.aid_types.length === 0)
      newErrors.aid_types = "Select at least one aid type.";
    if (!locationConfirmed) newErrors.location = "Confirm your location.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in first.");
      return navigate("/Landing");
    }
    if (!validateForm()) return;

    setSubmitting(true);

    const { error } = await supabase.from("aid_requests").insert({
      user_id: user.id,
      disaster_type: formData.disaster_type,
      severity: formData.severity,
      aid_types: formData.aid_types,
      latitude: formData.latitude,
      longitude: formData.longitude,
      status: "pending",
    });

    setSubmitting(false);

    if (error) {
      console.error(error);
      alert("Error submitting request");
      return;
    }

    navigate("/AidRequestSubmitted");
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-xl text-gray-900">
      <div className="flex items-center justify-between p-4 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="text-md text-sm hover:text-accent flex items-center"
        >
          &larr;
        </button>
        <h2 className="text-lg md:text-3xl font-bold text-primary text-center flex-1">
          Request Aid
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 lg:space-y-4">
        {/* Disaster Type */}
        <div>
          <label className="block font-medium mb-2">Type of Emergency</label>
          <select
            value={formData.disaster_type}
            onChange={(e) =>
              setFormData({ ...formData, disaster_type: e.target.value })
            }
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select one</option>
            {disasterOptions.map((d) => (
              <option key={d} value={d.toLowerCase()}>
                {d}
              </option>
            ))}
          </select>
          {errors.disaster_type && (
            <p className="text-red-500 text-sm mt-1">{errors.disaster_type}</p>
          )}
        </div>

        {/* Severity */}
        <div>
          <label className="block font-medium mb-2">Severity</label>
          <select
            value={formData.severity}
            onChange={(e) =>
              setFormData({ ...formData, severity: e.target.value })
            }
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select one</option>
            {severityOptions.map((s) => (
              <option key={s} value={s.toLowerCase()}>
                {s}
              </option>
            ))}
          </select>
          {errors.severity && (
            <p className="text-red-500 text-sm mt-1">{errors.severity}</p>
          )}
        </div>

        {/* Aid Types */}
        <div>
          <label className="block font-medium mb-2">What do you need?</label>
          <div className="flex flex-wrap gap-2">
            {aidOptions.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => toggleAidType(a.toLowerCase())}
                className={`px-3 py-1 rounded-lg border ${
                  formData.aid_types.includes(a.toLowerCase())
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          {errors.aid_types && (
            <p className="text-red-500 text-sm mt-1">{errors.aid_types}</p>
          )}
        </div>

        {/* Location */}
        <LocationPicker onLocationSelect={setTempLocation} />
        <div>
          {formData.latitude && formData.longitude && (
            <p className="text-sm text-gray-600">
              Selected Location: {formData.latitude.toFixed(4)},{" "}
              {formData.longitude.toFixed(4)}
            </p>
          )}
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}

          <button
            type="button"
            onClick={handleConfirmLocation}
            className={`w-full py-2 rounded-lg ${
              locationConfirmed
                ? "bg-green-500 text-white"
                : "bg-primary hover:bg-primary-dark text-white"
            }`}
          >
            {locationConfirmed ? "Location Confirmed" : "Confirm Location"}
          </button>
        </div>
        <div>
          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white py-2 rounded-lg disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
