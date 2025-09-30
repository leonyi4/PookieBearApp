import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LocationPicker from "../../components/LocationPicker";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  useUserProfile,
  useUpdateProfile,
  uploadProfilePicture,
} from "../../lib/api";

export default function CustomizeProfile() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // 1) Load profile (cached by React Query)
  const { data: profile, isLoading, error } = useUserProfile(user?.id);
  const updateProfile = useUpdateProfile(user?.id);

  // 2) Local form state
  const [formData, setFormData] = useState({});
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  // Location flow
  const [tempLocation, setTempLocation] = useState(null);
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  // UI states
  const [successful, setSuccessful] = useState(false);

  // 3) Prefill when profile arrives
  useEffect(() => {
    if (profile) {
      setFormData({ ...profile });
      // If the profile already has a location, show it as confirmed
      if (profile.latitude != null && profile.longitude != null) {
        setLocationConfirmed(true);
      }
    }
  }, [profile]);

  // Loading guards
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-primary">
        <LoadingSpinner message="Loading Form" />
      </div>
    );
  }
  if (!user) return null;

  // 4) Handlers
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

  const handleReset = () => {
    if (!profile) return;
    setFormData({ ...profile });
    setProfilePictureFile(null);
    setTempLocation(null);
    setLocationConfirmed(profile.latitude != null && profile.longitude != null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/Landing");

    try {
      let profile_picture_url = formData.profile_picture || null;

      // 5) Upload only if user picked a new file
      if (profilePictureFile) {
        profile_picture_url = await uploadProfilePicture(
          user.id,
          profilePictureFile
        );
      }

      // Normalize lat/lng for DB
      const updates = {
        ...formData,
        latitude:
          formData.latitude !== "" && formData.latitude != null
            ? Number(formData.latitude)
            : null,
        longitude:
          formData.longitude !== "" && formData.longitude != null
            ? Number(formData.longitude)
            : null,
        profile_picture: profile_picture_url,
        profile_complete: true,
      };

      await updateProfile.mutateAsync(updates);

      setSuccessful(true);
      setTimeout(() => {
        navigate("/Profile");
      }, 500);
    } catch (err) {
      alert("Error saving profile: " + err.message);
    }
  };

  // Required fields gate
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
    return required.every((f) => formData[f] && formData[f] !== "");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="text-primary text-lg hover:text-accent"
          >
            &larr;
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center flex-1">
            Edit Your Profile
          </h2>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-2">{error.message}</p>}

        {/* 6) Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fields */}
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
              <div key={field} className="flex flex-col">
                <label
                  htmlFor={field}
                  className="text-sm font-medium text-accent mb-1"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={
                    field === "birthdate"
                      ? "date"
                      : field === "age"
                      ? "number"
                      : field === "phone"
                      ? "tel"
                      : "text"
                  }
                  id={field}
                  placeholder={`Enter ${field}`}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
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
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <label className="text-sm font-medium text-accent">
            Update Your Location:
          </label>
          <div className="space-y-2">
            <LocationPicker onLocationSelect={setTempLocation} />
            {formData.latitude != null && formData.longitude != null && (
              <p className="text-sm text-gray-600">
                Current Location: {Number(formData.latitude).toFixed(4)},{" "}
                {Number(formData.longitude).toFixed(4)}
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
              disabled={
                !tempLocation && !formData.latitude && !formData.longitude
              }
            >
              {locationConfirmed ? "Location Confirmed" : "Confirm Location"}
            </button>
          </div>

          {/* Picture */}
          <label className="block text-gray-700 font-medium text-sm">
            Update Your Profile Picture:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePictureFile(e.target.files[0])}
              className="mt-2 block w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900"
            />
            {profilePictureFile && (
              <p className="text-sm text-green-600 mt-1">
                Selected:{" "}
                <span className="text-accent">{profilePictureFile.name}</span>
              </p>
            )}
          </label>

          {/* Actions */}
          {successful && (
            <p className="text-green-600 text-sm -mt-2">
              Profile updated successfully!
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-1/3 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:bg-secondary"
              disabled={updateProfile.isLoading}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => navigate("/Profile")}
              className="w-full sm:w-1/3 py-2 rounded-lg bg-accent text-white hover:bg-accent/90"
              disabled={updateProfile.isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateProfile.isLoading || !isFormValid()}
              className={`w-full sm:w-1/3 py-2 rounded-lg ${
                isFormValid()
                  ? "bg-primary hover:bg-primary-dark text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {updateProfile.isLoading ? "Saving…" : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
