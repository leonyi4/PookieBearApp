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
  });

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [tempLocation, setTempLocation] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState("");

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
          "name, identification, birthdate, country, city, latitude, longitude, profile_complete"
        )
        .eq("id", user.id)
        .single();

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

  const confirmLocation = () => {
    if (tempLocation) {
      setFormData((prev) => ({
        ...prev,
        latitude: tempLocation.lat,
        longitude: tempLocation.lng,
      }));
    }
  };

  const uploadImage = async (file) => {
    const fileName = `${user.id}-${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("profile_pictures")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from("profile_pictures")
      .getPublicUrl(fileName);

    return data.publicUrl;
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
    <div className="flex h-screen w-full items-center justify-center p-4 bg-cover bg-center">
      <div className="bg-background rounded-2xl shadow-lg w-[90%] max-w-md p-6">
        <h1 className="text-xl font-bold text-center text-primary mb-4">
          Complete Your Profile
        </h1>

        {fetchError && (
          <p className="text-red-500 text-sm mb-2">{fetchError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-accent">
          {["name", "identification", "birthdate", "country", "city"].map(
            (field) => (
              <input
                key={field}
                type={field === "birthdate" ? "date" : "text"}
                id={field}
                placeholder={field}
                className="w-full p-2 border rounded-lg text-accent"
                value={formData[field]}
                onChange={handleChange}
              />
            )
          )}

          <LocationPicker onLocationSelect={setTempLocation} />
          {tempLocation && (
            <button
              type="button"
              onClick={confirmLocation}
              className="w-full bg-primary text-white py-2 rounded-lg mt-2"
            >
              Confirm Location
            </button>
          )}

          <div className="text-accent p-2">
            <label className="text-sm font-medium mb-2 block">
              Upload Profile Picture (optional):
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-accent border border-accent bg-primary rounded-md px-2"
              onChange={(e) => setProfilePictureFile(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white py-2 rounded-lg mt-4 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
