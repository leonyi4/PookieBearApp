import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase-client";
import LocationPicker from "../components/LocationPicker";

export default function ProfileCompletion() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    identification: "",
    birthdate: "",
    country: "",
    city: "",
    latitude: "",
    longitude: "",
    phone: "",
    age: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [tempLocation, setTempLocation] = useState(null);
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load existing profile
  useEffect(() => {
    const loadProfile = async () => {
      if (loading) return;
      if (!user) return navigate("/Landing", { replace: true });

      const { data } = await supabase
        .from("users")
        .select(
          "name, identification, birthdate, country, city, latitude, longitude, phone, age, gender, profile_complete"
        )
        .eq("id", user.id)
        .single();

      if (data) {
        setFormData({ ...formData, ...data });
        if (data.profile_complete) navigate("/", { replace: true });
      }
    };

    loadProfile();
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: value ? "" : `${id} is required` }));
  };

  const handleConfirmLocation = () => {
    if (!tempLocation) return alert("Please select a location first!");
    setFormData((prev) => ({
      ...prev,
      latitude: tempLocation.lat,
      longitude: tempLocation.lng,
    }));
    setLocationConfirmed(true);
  };

  const isFormValid = () => {
    const required = [
      "name",
      "identification",
      "birthdate",
      "country",
      "city",
      "phone",
      "age",
      "gender",
    ];
    return required.every((field) => formData[field] && formData[field] !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setSaving(true);

    const updates = {
      ...formData,
      latitude: formData.latitude ? Number(formData.latitude) : null,
      longitude: formData.longitude ? Number(formData.longitude) : null,
      profile_complete: true,
    };

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id);
    setSaving(false);

    if (error) return alert("Error saving profile");

    alert("Profile completed!");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-accent">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-6">
        <h1 className="text-2xl font-bold text-center text-primary mb-6">
          Complete Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "name",
              "identification",
              "birthdate",
              "age",
              "gender",
              "country",
              "city",
              "phone",
            ].map((field) => (
              <div key={field} className="flex flex-col">
                <input
                  type={field === "birthdate" ? "date" : "text"}
                  id={field}
                  placeholder={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-accent focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors[field] && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors[field]}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Location Picker */}
          <div className="space-y-2">
            <LocationPicker onLocationSelect={setTempLocation} />
            <button
              type="button"
              onClick={handleConfirmLocation}
              className={`w-full py-2 rounded-lg transition ${
                locationConfirmed
                  ? "bg-green-500 text-white"
                  : "bg-primary hover:bg-primary-dark text-white"
              }`}
            >
              {locationConfirmed ? "Location Confirmed" : "Confirm Location"}
            </button>
          </div>

          {/* Save button */}
          <button
            type="submit"
            disabled={saving || !isFormValid()}
            className={`w-full py-2 rounded-lg transition ${
              isFormValid()
                ? "bg-primary hover:bg-primary-dark text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
