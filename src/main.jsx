import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Auth pages
import Landing from "./pages/Auth/Landing.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";

import ProfileCompletion from "./pages/Auth/ProfileCompletion.jsx";

import Home from "./pages/Home.jsx";

// Profile pages
import Profile from "./profile/Profile.jsx";
import CustomizeProfile from "./profile/CustomizeProfile.jsx";

// Aid Request pages
import AidRequestForm from "./pages/AidRequest/AidRequestForm.jsx";
import AidRequestSubmitted from "./pages/AidRequest/AidRequestSubmitted.jsx";

// Disaster pages
import DisaterMap from "./pages/Disasters/DisasterMap.jsx";
import DisasterDetail from "./pages/Disasters/DisasterDetail.jsx";

// Donation and Volunteer pages
import DonationVolunteerHome from "./pages/DonationsAndVolunteer/DonationVolunteerHome.jsx";
import DonationDetail from "./pages/DonationsAndVolunteer/Donations/DonationDetail.jsx";
import VolunteerDetail from "./pages/DonationsAndVolunteer/Volunteer/VolunteerDetail.jsx";

// Org and Sponsor pages
import OrgSponsorsHome from "./pages/OrgAndSponsor/OrgSponsorHome.jsx";
import SponsorDetail from "./pages/OrgAndSponsor/Sponsors/SponsorDetail.jsx";
import OrgDetail from "./pages/OrgAndSponsor/Organizations/OrgDetail.jsx";

// Layout and not found page
import MainLayout from "./layouts/MainLayout.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

const router = createBrowserRouter([
  { path: "/Landing", element: <Landing /> },
  { path: "/SignUp", element: <SignUp /> },
  { path: "ProfileCompletion", element: <ProfileCompletion /> },
  { path: "ResetPassword", element: <ResetPassword /> },

  // Main App (Protected)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: "CustomizeProfile", element: <CustomizeProfile /> },

      { path: "AidRequest", element: <AidRequestForm /> },
      { path: "AidRequestSubmitted", element: <AidRequestSubmitted /> },

      { path: "DisasterMap", element: <DisaterMap /> },
      { path: "DisasterMap/:disasterId", element: <DisasterDetail /> },

      {
        path: "DonationsAndVolunteers",
        element: <Navigate to="/DonationsAndVolunteers/donations" replace />,
      },
      {
        path: "DonationsAndVolunteers/:type",
        element: <DonationVolunteerHome />,
      },
      {
        path: "DonationsAndVolunteers/donations/:donationId",
        element: <DonationDetail />,
      },

      {
        path: "DonationsAndVolunteers/volunteers/:volunteerId",
        element: <VolunteerDetail />,
      },
      {
        path: "OrgsAndSponsors",
        element: <Navigate to="/OrgsAndSponsors/organizations" replace />,
      },
      { path: "OrgsAndSponsors/:type", element: <OrgSponsorsHome /> },
      { path: "OrgsAndSponsors/organizations/:orgId", element: <OrgDetail /> },
      {
        path: "OrgsAndSponsors/sponsors/:sponsorId",
        element: <SponsorDetail />,
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
