import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  Outlet,
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Landing from "./pages/Auth/Landing.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";

import Home from "./pages/Home.jsx";
import DisaterMap from "./pages/Disasters/DisasterMap.jsx";
import DisasterDetail from "./pages/Disasters/DisasterDetail.jsx";

import Donations from "./pages/Donations/Donations.jsx";
import ReliefDetail from "./pages/Donations/ReliefDetail.jsx";

import Loading from "./pages/Loading.jsx";
import Organizations from "./pages/Organizations/Organizations.jsx";
import OrgDetail from "./pages/Organizations/OrgDetail.jsx";

import StartFundRaiser from "./pages/Fundraisers/StartFundRaiser.jsx";
import FundRaiserDashboard from "./pages/Fundraisers/FundRaiserDashboard.jsx";

import Sponsors from "./pages/Sponsors/Sponsors.jsx";
import SponsorDetail from "./pages/Sponsors/SponsorDetail.jsx";

import MainLayout from "./layouts/MainLayout.jsx";
import OrgSponsorsHome from "./pages/OrgAndSponsor/OrgSponsorHome.jsx";

const router = createBrowserRouter([
  { path: "/Landing", element: <Landing /> },
  { path: "/SignUp", element: <SignUp /> },

  /* Main application pages with layout */
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },

      { path: "DisasterMap", element: <DisaterMap /> },
      { path: "DisasterMap/:disasterId", element: <DisasterDetail /> },

      { path: "donations", element: <Donations /> },
      { path: "donations/:reliefId", element: <ReliefDetail /> },

      { path: "/StartFundRaiser", element: <StartFundRaiser /> },
      { path: "/FundraiserDashboard", element: <FundRaiserDashboard /> },

      {
        path: "OrgsAndSponsors/",
        element: <Navigate to="/OrgsAndSponsors/organizations" replace />,
      },
      { path: "OrgsAndSponsors/:type", element: <OrgSponsorsHome /> },

      { path: "Organizations", element: <Organizations /> },
      { path: "Organizations/:orgId", element: <OrgDetail /> },

      { path: "Sponsors", element: <Sponsors /> },
      { path: "Sponsors/:sponsorId", element: <SponsorDetail /> },
    ],
  },

  // { path: '/OrgDetail', element: <OrgDetail /> },
  // { path: '/FundRaiserDashboard', element: <FundRaiserDashboard /> },
  // { path: '*', element: <NotFoundPage /> }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
