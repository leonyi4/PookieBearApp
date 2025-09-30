import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfile } from "../../lib/api";
import { supabase } from "../../lib/supabase-client";
import LocationPicker from "../../components/LocationPicker";

export default function CustomizeProfile() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({});
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [tempLocation, setTempLocation] = useState(null);
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: () => fetchUserProfile(user.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

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
      navigate("/Profile");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let profile_picture_url = profile?.profile_picture;
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
    mutation.mutate({ ...formData, profile_picture: profile_picture_url });
  };

  if (loading || isLoading) return <p>Loading…</p>;
  if (!user) return null;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* inputs as before, using formData + handleChange */}
      <input id="name" value={formData.name || ""} onChange={handleChange} />
      {/* ... other fields ... */}
      <LocationPicker onLocationSelect={setTempLocation} />
      <button type="button" onClick={handleConfirmLocation}>
        Confirm Location
      </button>
      <input
        type="file"
        onChange={(e) => setProfilePictureFile(e.target.files[0])}
      />
      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? "Saving…" : "Save Profile"}
      </button>
    </form>
  );
}
