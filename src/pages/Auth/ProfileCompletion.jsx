import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfile } from "../../lib/api";
import { supabase } from "../../lib/supabase-client";
import LocationPicker from "../../components/LocationPicker";

export default function ProfileCompletion() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();

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
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  // Fetch profile (React Query handles caching/loading/error)
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: () => fetchUserProfile(user.id),
    enabled: !!user,
  });

  // Prefill when profile arrives
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || "",
        identification: profile.identification || "",
        birthdate: profile.birthdate || "",
        country: profile.country || "",
        city: profile.city || "",
        latitude: profile.latitude ?? "",
        longitude: profile.longitude ?? "",
        phone: profile.phone || "",
        age: profile.age || "",
        gender: profile.gender || "",
      }));
      if (profile.profile_complete) navigate("/", { replace: true });
    }
  }, [profile, navigate]);

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
      setLocationConfirmed(true);
    }
  };

  // Mutation for saving profile
  const mutation = useMutation({
    mutationFn: async (updates) => {
      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile", user.id]);
      navigate("/");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    mutation.mutate({
      ...formData,
      latitude: formData.latitude ? Number(formData.latitude) : null,
      longitude: formData.longitude ? Number(formData.longitude) : null,
      profile_picture: profile_picture_url,
      profile_complete: true,
    });
  };

  if (loading || profileLoading)
    return (
      <div className="flex h-screen items-center justify-center">Loading…</div>
    );
  if (!user) return null;
  if (profileError)
    return <p className="text-red-500">{profileError.message}</p>;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="bg-background rounded-2xl shadow-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-4">
          Complete Your Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="text-sm font-medium">{field}</label>
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
                value={formData[field] || ""}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
          ))}

          {/* Gender dropdown */}
          <select
            id="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Select gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          {/* Location */}
          <LocationPicker onLocationSelect={setTempLocation} />
          <button type="button" onClick={handleConfirmLocation}>
            {locationConfirmed ? "Location Confirmed" : "Confirm Location"}
          </button>

          {/* Picture */}
          <input
            type="file"
            onChange={(e) => setProfilePictureFile(e.target.files[0])}
          />

          <button
            type="submit"
            disabled={mutation.isLoading}
            className="bg-primary text-white py-2 rounded w-full"
          >
            {mutation.isLoading ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
