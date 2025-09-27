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

import Landing from "./pages/Auth/Landing.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";
import Profile from "./profile/Profile.jsx";
import ProfileCompletion from "./pages/Auth/ProfileCompletion.jsx";

import Home from "./pages/Home.jsx";

import AidRequestForm from "./pages/AidRequest/AidRequestForm.jsx";
import CustomizeProfile from "./profile/CustomizeProfile.jsx";
import AidRequestSubmitted from "./pages/AidRequest/AidRequestSubmitted.jsx";

import DisaterMap from "./pages/Disasters/DisasterMap.jsx";
import DisasterDetail from "./pages/Disasters/DisasterDetail.jsx";

import DonationVolunteerHome from "./pages/DonationsAndVolunteer/DonationVolunteerHome.jsx";
import Donations from "./pages/DonationsAndVolunteer/Donations/Donations.jsx";
import DonationDetail from "./pages/DonationsAndVolunteer/Donations/DonationDetail.jsx";
import Volunteers from "./pages/DonationsAndVolunteer/Volunteer/Volunteers.jsx";
import VolunteerDetail from "./pages/DonationsAndVolunteer/Volunteer/VolunteerDetail.jsx";

import Sponsors from "./pages/OrgAndSponsor/Sponsors/Sponsors.jsx";


import StartFundRaiser from "./pages/Fundraisers/StartFundRaiser.jsx";
import FundRaiserDashboard from "./pages/Fundraisers/FundRaiserDashboard.jsx";

import OrgDetail from "./pages/OrgAndSponsor/Organizations/OrgDetail.jsx";
import SponsorDetail from "./pages/OrgAndSponsor/Sponsors/SponsorDetail.jsx";

import MainLayout from "./layouts/MainLayout.jsx";
import OrgSponsorsHome from "./pages/OrgAndSponsor/OrgSponsorHome.jsx";
import Organizations from "./pages/OrgAndSponsor/Organizations/Organizations.jsx";

const router = createBrowserRouter([
  { path: "/Landing", element: <Landing /> },
  { path: "/SignUp", element: <SignUp /> },
  { path: "ProfileCompletion", element: <ProfileCompletion /> },

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

      { path: "donations", element: <Donations /> },
      { path: "volunteers", element: <Volunteers /> },

      // { path: "StartFundRaiser", element: <StartFundRaiser /> },
      // { path: "FundraiserDashboard", element: <FundRaiserDashboard /> },

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

      { path: "Organizations", element: <Organizations/>},
      { path: "Sponsors", element: <Sponsors />},
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
