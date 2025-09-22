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
import Home from "./pages/Home.jsx";
import DisaterMap from "./pages/Disasters/DisasterMap.jsx";
import DisasterDetail from "./pages/Disasters/DisasterDetail.jsx";

import Donations from "./pages/Donations/Donations.jsx";
import DonationDetail from "./pages/Donations/DonationDetail.jsx";
import Volunteers from "./pages/Volunteer/Volunteers.jsx";
import VolunteerDetail from "./pages/Volunteer/VolunteerDetail.jsx";

import StartFundRaiser from "./pages/Fundraisers/StartFundRaiser.jsx";
import FundRaiserDashboard from "./pages/Fundraisers/FundRaiserDashboard.jsx";
import OrgDetail from "./pages/Organizations/OrgDetail.jsx";
import SponsorDetail from "./pages/Sponsors/SponsorDetail.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import OrgSponsorsHome from "./pages/OrgAndSponsor/OrgSponsorHome.jsx";

const router = createBrowserRouter([
  { path: "/Landing", element: <Landing /> },
  { path: "/SignUp", element: <SignUp /> },

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

      { path: "DisasterMap", element: <DisaterMap /> },
      { path: "DisasterMap/:disasterId", element: <DisasterDetail /> },

      { path: "donations", element: <Donations /> },
      { path: "donations/:reliefId", element: <DonationDetail /> },

      { path: "volunteers", element: <Volunteers /> },
      { path: "volunteers/:volunteerId", element: <VolunteerDetail /> },

      { path: "StartFundRaiser", element: <StartFundRaiser /> },
      { path: "FundraiserDashboard", element: <FundRaiserDashboard /> },

      {
        path: "OrgsAndSponsors/",
        element: <Navigate to="/OrgsAndSponsors/organizations" replace />,
      },
      { path: "OrgsAndSponsors/:type", element: <OrgSponsorsHome /> },
      { path: "OrgsAndSponsors/organizations/:orgId", element: <OrgDetail /> },
      { path: "OrgsAndSponsors/sponsors/:sponsorId", element: <SponsorDetail /> },
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
