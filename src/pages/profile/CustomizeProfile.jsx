import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase-client";
import LocationPicker from "../../components/LocationPicker";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function CustomizeProfile() {
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
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [tempLocation, setTempLocation] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [successful, setSuccessful] = useState(false);

  const [locationConfirmed, setLocationConfirmed] = useState(false);
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/Landing", { replace: true });

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("users")
        .select(
          "name, identification, birthdate, country, city, latitude, longitude, profile_complete, phone, age, gender"
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
    setFormData((prev) => ({ ...prev, [id]: value }));
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

    setSuccessful(true);
    setTimeout(() => {
      navigate("/Profile");
    }, 2000);
  };


  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-primary">
        <LoadingSpinner message="Loading Form" />
      </div>
    );
  if (!user) return null;

  const isFormValid = () => {
    const requiredFields = [
      "name",
      "identification",
      "birthdate",
      "country",
      "city",
      "phone",
      "age",
      "gender",
    ];
    return requiredFields.every(
      (field) => formData[field] && formData[field] !== ""
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 w-full max-w-2xl">
        <div className="flex items-center space-x-4 sm:p-6 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-primary text-lg hover:text-accent"
          >
            &larr;
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            Edit Your Profile
          </h2>
        </div>

        {fetchError && (
          <p className="text-red-500 text-sm mb-2">{fetchError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "name",
              "identification",
              "birthdate",
              "country",
              "city",
              "phone",
              "age",
            ].map((field) => (
              <input
                key={field}
                type={
                  field === "birthdate"
                    ? "date"
                    : field === "age"
                    ? "number"
                    : "text"
                }
                id={field}
                placeholder={`Enter ${field}`}
                value={formData[field] || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ))}

            {/* Gender dropdown */}
            <select
              id="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location Picker */}
          <div className="space-y-2">
            <LocationPicker onLocationSelect={setTempLocation} />
            {/* show selected location */}
            {formData.latitude && formData.longitude && (
              <p className="text-sm text-gray-600">
                Current Location: {formData.latitude.toFixed(4)},{" "}
                {formData.longitude.toFixed(4)}
              </p>
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
              {locationConfirmed ? `Location Confirmed` : `Confirm Location`}
            </button>
          </div>

          {/* Profile picture */}
          <label className="block text-gray-700 font-medium">
            Upload Profile Picture (optional):
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePictureFile(e.target.files[0])}
              className="mt-2 block w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900"
            />
            {/* show successful upload*/}
            {profilePictureFile && (
              <p className="text-sm text-green-600 mt-1">
                Selected:{" "}
                <span className="text-accent">{profilePictureFile.name}</span>
              </p>
            )}
          </label>

          {/* Save button */}
          {successful && (
            <p className="text-green-600 text-sm mb-2">
              Profile updated successfully!
            </p>
          )}
          <button
            type="submit"
            disabled={saving || !isFormValid()}
            className={`w-full py-2 rounded-lg ${
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
