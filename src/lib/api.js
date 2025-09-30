// src/lib/api.js
import { supabase } from "./supabase-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* =========================================================
   🌍 HOME / DISCOVER PAGE (General Data)
   ========================================================= */

export async function fetchDisasters() {
  const { data, error } = await supabase
    .from("disasters")
    .select("id, name, latitude, longitude");
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchDisastersWithRelations() {
  const { data: disasters, error } = await supabase
    .from("disasters")
    .select("*");
  if (error) throw new Error(error.message);

  const enrichedDisasters = await Promise.all(
    disasters.map(async (disaster) => {
      // Donations
      const { data: donationLinks } = await supabase
        .from("disaster_donations")
        .select("donation_id")
        .eq("disaster_id", disaster.id);

      let donations = [];
      if (donationLinks?.length) {
        const ids = donationLinks.map((d) => d.donation_id);
        const { data } = await supabase
          .from("donations")
          .select("*")
          .in("id", ids);
        donations = data || [];
      }

      // Volunteers
      const { data: volunteerLinks } = await supabase
        .from("disaster_volunteers")
        .select("volunteers_id")
        .eq("disaster_id", disaster.id);

      let volunteers = [];
      if (volunteerLinks?.length) {
        const ids = volunteerLinks.map((v) => v.volunteers_id);
        const { data } = await supabase
          .from("volunteers")
          .select("*")
          .in("id", ids);
        volunteers = data || [];
      }

      return { ...disaster, donations, volunteers };
    })
  );

  return enrichedDisasters;
}

export async function fetchDisasterById(id) {
  const { data, error } = await supabase
    .from("disasters")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/* =========================================================
   🌍 DISASTER DETAIL (with relations)
   ========================================================= */

export async function fetchDisasterDonations(disasterId) {
  const { data: links, error } = await supabase
    .from("disaster_donations")
    .select("donation_id")
    .eq("disaster_id", disasterId);

  if (error) throw new Error(error.message);
  if (!links?.length) return [];

  const ids = links.map((l) => l.donation_id);
  const { data: donations, error: donationsError } = await supabase
    .from("donations")
    .select("*")
    .in("id", ids);

  if (donationsError) throw new Error(donationsError.message);
  return donations || [];
}

export async function fetchDisasterVolunteers(disasterId) {
  const { data: links, error } = await supabase
    .from("disaster_volunteers")
    .select("volunteers_id")
    .eq("disaster_id", disasterId);

  if (error) throw new Error(error.message);
  if (!links?.length) return [];

  const ids = links.map((l) => l.volunteers_id);
  const { data: volunteers, error: volunteersError } = await supabase
    .from("volunteers")
    .select("*")
    .in("id", ids);

  if (volunteersError) throw new Error(volunteersError.message);
  return volunteers || [];
}

/* =========================================================
   💰 DONATIONS PAGE
   ========================================================= */

export async function fetchDonations() {
  const { data, error } = await supabase
    .from("donations")
    .select(
      "id, name, description, goal, raised, latitude, longitude, disaster_id, image"
    );
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchDonationById(donationId) {
  const { data, error } = await supabase
    .from("donations")
    .select(
      `
      id, name, description, goal, raised, image,
      budget_allocation, org_id, latitude, longitude, disaster_id
    `
    )
    .eq("id", donationId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchDonationContributions(donationId) {
  const { data, error } = await supabase
    .from("donation_contributions")
    .select(`contributions ( id, name, description )`)
    .eq("donation_id", donationId);

  if (error) throw new Error(error.message);
  return data?.map((c) => c.contributions) || [];
}

/* =========================================================
   🙋 VOLUNTEERS PAGE
   ========================================================= */

export async function fetchVolunteers() {
  const { data, error } = await supabase
    .from("volunteers")
    .select(
      "id, name, description, latitude, longitude, disaster_id, impact, image"
    );
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchVolunteerById(id) {
  const { data, error } = await supabase
    .from("volunteers")
    .select(
      `
      id, name, description, image, impact,
      org_id, latitude, longitude, disaster_id
    `
    )
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchVolunteerRoles(volunteerId) {
  const { data, error } = await supabase
    .from("volunteer_roles")
    .select(`roles ( id, title, commitment, skills_required )`)
    .eq("volunteer_id", volunteerId);

  if (error) throw new Error(error.message);
  return data?.map((r) => r.roles) || [];
}

/* =========================================================
   🏢 ORGANIZATIONS PAGE
   ========================================================= */

export async function fetchOrgs() {
  const { data, error } = await supabase
    .from("organizations")
    .select("id, name, logo, tags, ratings");
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchOrgById(id) {
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchOrgRelations() {
  const { data: orgDonations, error: donationsError } = await supabase
    .from("org_donations")
    .select("donation_id, org_id");
  if (donationsError) throw donationsError;

  const { data: orgVolunteers, error: volunteersError } = await supabase
    .from("org_volunteers")
    .select("volunteer_id, org_id");
  if (volunteersError) throw volunteersError;

  return { orgDonations, orgVolunteers };
}

export async function fetchOrgDonations(orgId) {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("org_id", orgId);
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchOrgVolunteers(orgId) {
  const { data, error } = await supabase
    .from("volunteers")
    .select("*")
    .eq("org_id", orgId);
  if (error) throw new Error(error.message);
  return data || [];
}

/* =========================================================
   ⭐ SPONSORS PAGE
   ========================================================= */

export async function fetchSponsors() {
  const { data, error } = await supabase
    .from("sponsors")
    .select("id, name, logo");
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchSponsorById(id) {
  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchSponsorEvents(sponsorId) {
  const { data, error } = await supabase
    .from("sponsor_events")
    .select("*")
    .eq("sponsor_id", sponsorId);
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchSponsorDonations(sponsorId) {
  const { data: donationLinks, error } = await supabase
    .from("sponsor_donations")
    .select("donation_id")
    .eq("sponsor_id", sponsorId);
  if (error) throw new Error(error.message);
  if (!donationLinks?.length) return [];

  const ids = donationLinks.map((d) => d.donation_id);
  const { data: donations, error: donationError } = await supabase
    .from("donations")
    .select("*")
    .in("id", ids);
  if (donationError) throw new Error(donationError.message);
  return donations || [];
}

export async function fetchSponsorVolunteers(sponsorId) {
  const { data: volunteerLinks, error } = await supabase
    .from("sponsor_volunteers")
    .select("volunteer_id")
    .eq("sponsor_id", sponsorId);
  if (error) throw new Error(error.message);
  if (!volunteerLinks?.length) return [];

  const ids = volunteerLinks.map((v) => v.volunteer_id);
  const { data: volunteers, error: volunteerError } = await supabase
    .from("volunteers")
    .select("*")
    .in("id", ids);
  if (volunteerError) throw new Error(volunteerError.message);
  return volunteers || [];
}

export async function fetchSponsorOrganizations(donations, volunteers) {
  const { data: orgDonationLinks } = await supabase
    .from("org_donations")
    .select("org_id")
    .in("donation_id", donations?.map((d) => d.id) || []); // ✅ use id

  const { data: orgVolunteerLinks } = await supabase
    .from("org_volunteers")
    .select("org_id")
    .in("volunteer_id", volunteers?.map((v) => v.id) || []); // ✅ use id

  const orgIds = [
    ...(orgDonationLinks?.map((o) => o.org_id) || []),
    ...(orgVolunteerLinks?.map((o) => o.org_id) || []),
  ];

  if (!orgIds.length) return [];

  const { data: relatedOrgs, error } = await supabase
    .from("organizations")
    .select("*")
    .in("id", orgIds);

  if (error) throw new Error(error.message);
  return relatedOrgs || [];
}

/* =========================================================
   👤 USER PROFILE & AID REQUESTS
   ========================================================= */

// --- Profile
export async function fetchUserProfile(userId) {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, name, identification, birthdate, country, city, phone, latitude, longitude, profile_picture, profile_complete, age, gender"
    )
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data; // may be null if row doesn't exist yet
}

export const useUserProfile = (userId) =>
  useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
  });

export const useUpdateProfile = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates) => {
      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile", userId]);
    },
  });
};

export const uploadProfilePicture = async (userId, file) => {
  const fileName = `${userId}-${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("profile_pictures")
    .upload(fileName, file);

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage
    .from("profile_pictures")
    .getPublicUrl(fileName);
  return data.publicUrl;
};

// --- Aid Requests
export const fetchUserAidRequests = async (userId) => {
  const { data, error } = await supabase
    .from("aid_requests")
    .select("*, organizations ( id, name, logo )")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

export const useUserAidRequests = (userId) =>
  useQuery({
    queryKey: ["aidRequests", userId],
    queryFn: () => fetchUserAidRequests(userId),
    enabled: !!userId,
  });

export const useCreateAidRequest = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newRequest) => {
      const { error } = await supabase.from("aid_requests").insert(newRequest);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      // make sure list auto-updates in Profile page
      queryClient.invalidateQueries(["aidRequests", userId]);
    },
  });
};

// --- Contributions
export const fetchUserContributions = async (userId) => {
  const { data, error } = await supabase
    .from("user_contributions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const useUserContributions = (userId) =>
  useQuery({
    queryKey: ["contributions", userId],
    queryFn: () => fetchUserContributions(userId),
    enabled: !!userId,
  });

// Hooks

// --- Disasters
export const useDisasterById = (disasterId) =>
  useQuery({
    queryKey: ["disaster", disasterId],
    queryFn: () => fetchDisasterById(disasterId),
    enabled: !!disasterId,
  });

export const useDisasterDonations = (disasterId) =>
  useQuery({
    queryKey: ["disasterDonations", disasterId],
    queryFn: () => fetchDisasterDonations(disasterId),
    enabled: !!disasterId,
  });

export const useDisasterVolunteers = (disasterId) =>
  useQuery({
    queryKey: ["disasterVolunteers", disasterId],
    queryFn: () => fetchDisasterVolunteers(disasterId),
    enabled: !!disasterId,
  });

// -- Sponsor
export const useSponsors = () =>
  useQuery({
    queryKey: ["sponsors"],
    queryFn: fetchSponsors,
  });

export const useSponsorById = (sponsorId) =>
  useQuery({
    queryKey: ["sponsor", sponsorId],
    queryFn: () => fetchSponsorById(sponsorId),
    enabled: !!sponsorId,
  });

export const useSponsorEvents = (sponsorId) =>
  useQuery({
    queryKey: ["sponsorEvents", sponsorId],
    queryFn: () => fetchSponsorEvents(sponsorId),
    enabled: !!sponsorId,
  });

export const useSponsorDonations = (sponsorId) =>
  useQuery({
    queryKey: ["sponsorDonations", sponsorId],
    queryFn: () => fetchSponsorDonations(sponsorId),
    enabled: !!sponsorId,
  });

export const useSponsorVolunteers = (sponsorId) =>
  useQuery({
    queryKey: ["sponsorVolunteers", sponsorId],
    queryFn: () => fetchSponsorVolunteers(sponsorId),
    enabled: !!sponsorId,
  });

export const useSponsorOrganizations = (sponsorId, donations, volunteers) =>
  useQuery({
    queryKey: ["sponsorOrganizations", sponsorId],
    queryFn: () => fetchSponsorOrganizations(donations, volunteers),
    enabled: !!sponsorId && !!donations && !!volunteers,
  });

// --- Organizations
export const useOrgs = () =>
  useQuery({
    queryKey: ["organizations"],
    queryFn: fetchOrgs,
  });

export const useOrgById = (orgId) =>
  useQuery({
    queryKey: ["organization", orgId],
    queryFn: () => fetchOrgById(orgId),
    enabled: !!orgId,
  });

export const useOrgDonations = (orgId) =>
  useQuery({
    queryKey: ["orgDonations", orgId],
    queryFn: () => fetchOrgDonations(orgId),
    enabled: !!orgId,
  });

export const useOrgVolunteers = (orgId) =>
  useQuery({
    queryKey: ["orgVolunteers", orgId],
    queryFn: () => fetchOrgVolunteers(orgId),
    enabled: !!orgId,
  });

/* =========================================================
   💰 DONATION HOOKS
   ========================================================= */

export const useDonationById = (donationId) =>
  useQuery({
    queryKey: ["donation", donationId],
    queryFn: () => fetchDonationById(donationId),
    enabled: !!donationId,
  });

export const useDonationContributions = (donationId) =>
  useQuery({
    queryKey: ["donationContributions", donationId],
    queryFn: () => fetchDonationContributions(donationId),
    enabled: !!donationId,
  });

/* =========================================================
   🙋 VOLUNTEER HOOKS
   ========================================================= */

export const useVolunteerById = (volunteerId) =>
  useQuery({
    queryKey: ["volunteer", volunteerId],
    queryFn: () => fetchVolunteerById(volunteerId),
    enabled: !!volunteerId,
  });

export const useVolunteerRoles = (volunteerId) =>
  useQuery({
    queryKey: ["volunteerRoles", volunteerId],
    queryFn: () => fetchVolunteerRoles(volunteerId),
    enabled: !!volunteerId,
  });
