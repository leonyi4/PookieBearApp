import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { supabase } from "../lib/supabase-client"; 
import LocationPicker from "../components/LocationPicker";

export default function Profile() {
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

  // Load profile data
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/Landing", { replace: true });

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("users")
        .select(
          "name, identification, birthdate, country, city, latitude, longitude, profile_complete, phone"
        )
        .eq("id", user.id)
        .single();

      if (error) return setFetchError(error.message);
      if (data) setFormData({ ...data });
    };

    loadProfile();
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleConfirmLocation = () => {
    if (!tempLocation) return alert("Please select a location first!");
    setFormData(prev => ({
      ...prev,
      latitude: tempLocation.lat,
      longitude: tempLocation.lng,
    }));
    alert("Location confirmed!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/Landing");

    setSaving(true);

    let profile_picture_url =
      "https://fenufabnjvlenskedegj.supabase.co/storage/v1/object/public/profile_pictures/default.png";

    if (profilePictureFile) {
      const fileName = `${user.id}-${Date.now()}-${profilePictureFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("profile_pictures")
        .upload(fileName, profilePictureFile);
      if (!uploadError) {
        const { data } = supabase.storage
          .from("profile_pictures")
          .getPublicUrl(fileName);
        profile_picture_url = data.publicUrl;
      }
    }

    const updates = {
      ...formData,
      latitude: formData.latitude ? Number(formData.latitude) : null,
      longitude: formData.longitude ? Number(formData.longitude) : null,
      profile_picture: profile_picture_url,
      profile_complete: true,
    };

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id);

    setSaving(false);

    if (error) return alert("Error saving profile");

    alert("Profile updated successfully!");
    navigate("/");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-primary">
        Loading…
      </div>
    );
  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-primary mb-4">
          Edit Your Profile
        </h1>

        {fetchError && <p className="text-red-500 text-sm mb-2">{fetchError}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "identification", "birthdate", "country", "city", "phone"].map(
            (field) => (
              <input
                key={field}
                type={field === "birthdate" ? "date" : "text"}
                id={field}
                placeholder={`Enter ${field}`}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )
          )}

          <LocationPicker onLocationSelect={setTempLocation} />

          <button
            type="button"
            onClick={handleConfirmLocation}
            className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg"
          >
            Confirm Location
          </button>

          <label className="block text-gray-900">
            Upload Profile Picture (optional):
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePictureFile(e.target.files[0])}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900"
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
