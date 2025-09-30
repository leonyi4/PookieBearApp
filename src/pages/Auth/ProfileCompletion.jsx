import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase-client";
import LocationPicker from "../../components/LocationPicker";

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
  });

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [tempLocation, setTempLocation] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  // Fetch current profile row to prefill (so users can resume)
  useEffect(() => {
    const loadProfile = async () => {
      if (loading) return;
      if (!user) {
        navigate("/Landing", { replace: true });
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select(
          "name, identification, birthdate, country, city, latitude, longitude, profile_complete, phone, age, gender"
        )
        .eq("id", user.id)
        .single();

      // console.log(data);

      if (error) {
        // If no row, create minimal one so updates succeed
        if (
          error.code === "PGRST116" ||
          error.details?.includes("Results contain 0 rows")
        ) {
          await supabase.from("users").insert({
            id: user.id,
            email: user.email,
            profile_complete: false,
          });
        } else {
          setFetchError(error.message);
        }
        return;
      }

      if (data) {
        setFormData((prev) => ({
          ...prev,
          name: data.name || "",
          identification: data.identification || "",
          birthdate: data.birthdate || "",
          country: data.country || "",
          city: data.city || "",
          latitude: data.latitude ?? "",
          longitude: data.longitude ?? "",
          phone: data.phone || "",
          age: data.age || "",
          gender: data.gender || "",
        }));

        // If they somehow already completed, send them home
        if (data.profile_complete) {
          navigate("/", { replace: true });
        }
      }
    };

    loadProfile();
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleConfirmLocation = () => {
    if (tempLocation) {
      setFormData((prev) => ({
        ...prev,
        latitude: tempLocation.lat,
        longitude: tempLocation.lng,
      }));
    }
    setLocationConfirmed(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Session expired. Please log in again.");
      return navigate("/Landing");
    }

    setSaving(true);

    let profile_picture_url =
      "https://fenufabnjvlenskedegj.supabase.co/storage/v1/object/public/profile_pictures/tung_tung_tung_tung_sahur.png";

    if (profilePictureFile) {
      const imageUrl = await uploadImage(profilePictureFile);
      if (imageUrl) profile_picture_url = imageUrl;
    }

    const updates = {
      name: formData.name,
      identification: formData.identification,
      birthdate: formData.birthdate || null,
      country: formData.country,
      city: formData.city,
      latitude: formData.latitude !== "" ? Number(formData.latitude) : null,
      longitude: formData.longitude !== "" ? Number(formData.longitude) : null,
      profile_picture: profile_picture_url,
      profile_complete: true,
      phone: formData.phone,
      age: formData.age || null,
      gender: formData.gender || null,
    };

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Error saving profile");
      return;
    }

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

  if (!user) {
    return null; // Redirect will run in useEffect
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 bg-cover bg-center">
      <div className="bg-background rounded-2xl shadow-lg w-full max-w-md md:max-w-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-center text-primary mb-4">
          Complete Your Profile
        </h1>

        {fetchError && (
          <p className="text-red-500 text-sm mb-2">{fetchError}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-1 lg:space-y-3 text-accent"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "name", label: "Full Name" },
              { id: "identification", label: "Identification Number" },
              { id: "birthdate", label: "Date of Birth" },
              { id: "country", label: "Country" },
              { id: "city", label: "City" },
              { id: "phone", label: "Phone Number" },
              { id: "age", label: "Age" },
            ].map(({ id, label }) => (
              <div key={id} className="flex flex-col">
                <label
                  htmlFor={id}
                  className="text-sm font-medium text-accent mb-1"
                >
                  {label}
                </label>
                <input
                  type={
                    id === "birthdate"
                      ? "date"
                      : id === "age"
                      ? "number"
                      : id === "phone"
                      ? "tel"
                      : "text"
                  }
                  id={id}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  className="w-full p-2 border rounded-lg text-accent focus:ring-2 focus:ring-primary"
                  value={formData[id] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}
            {/* Gender */}
            <div className="flex flex-col">
              <label
                htmlFor="gender"
                className="text-sm font-medium text-accent mb-1"
              >
                Gender
              </label>
              <select
                id="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg text-accent focus:ring-2 focus:ring-primary"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          {/* Select your current location */}
          <label className="text-sm font-medium text-accent">
            Select Your Current Location:
          </label>
          <LocationPicker onLocationSelect={setTempLocation} />
          {tempLocation && (
            <button
              type="button"
              onClick={handleConfirmLocation}
              className={`w-full  text-accent py-2 rounded-lg mt-2 hover:bg-opacity-80 ${
                locationConfirmed ? "bg-green-300" : "bg-secondary"
              }`}
            >
              Confirm Location
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white py-2 rounded-lg mt-2 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
