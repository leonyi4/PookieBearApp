import React from "react";
import header_logo from "../assets/header_logo.png";
import { NavLink } from "react-router-dom";
import vertical_logo from "../assets/Vertical_logo.png";
import Button from "./Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import  {useLockBodyScroll}  from "../hooks/useLockBodyScroll.jsx"


//
const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  // const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  useLockBodyScroll(isMenuOpen); // Lock scroll when menu is open

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky  bg-white border-accent shadow-sm" >
      {/* Default Header */}
      {!isMenuOpen && (
        <header className="sticky bg-white border-b border-accent shadow-sm z-100000">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-6">
            <NavLink to="/">
              <img src={header_logo} alt="logo" width={150} />
            </NavLink>
            <Button type="button" onClick={setIsMenuOpen}>
              Menu
            </Button>
          </nav>
        </header>
      )}

      {/* Drop Down Menu */}
      {isMenuOpen && (
        <header className="fixed inset-0 z-1000 bg-white  flex flex-col items-center justify-center px-6 py-8 menu-overlay">
          <button
            onClick={toggleMenu}
            className="absolute top-6 right-6 text-gray-600 hover:text-red-500 text-xl font-bold"
          >
            ✕
          </button>

          <nav className="space-y-6 text-center flex flex-col items-center">
            <NavLink to="/" onClick={toggleMenu}>
              <img src={vertical_logo} alt="logo" width={150} />
            </NavLink>
            <NavLink
              to="/"
              onClick={toggleMenu}
              className="text-2xl text-primary hover:text-accent font-medium"
            >
              Home
            </NavLink>
            <hr className="border-accent w-screen" />
            <NavLink
              to="/DisasterMap"
              onClick={toggleMenu}
              className="text-2xl text-primary hover:text-accent font-medium"
            >
              Disaster Map
            </NavLink>
            <hr className="border-accent w-screen" />
            <NavLink
              to="/Donations"
              onClick={toggleMenu}
              className="text-2xl text-primary hover:text-accent font-medium"
            >
              Donations
            </NavLink>
            <hr className="border-accent w-screen" />
            {/* Org and Sponsor*/}

            <NavLink
              to="/OrgsAndSponsors/organizations"
              onClick={toggleMenu}
              className="text-2xl text-primary hover:text-accent font-medium"
            >
              Orgs & Sponsors
            </NavLink>
            <hr className="border-accent w-screen" />
            <NavLink
              to="/StartFundRaiser"
              onClick={toggleMenu}
              className="text-2xl text-primary hover:text-accent font-medium"
            >
              Start Fundraiser
            </NavLink>
            <hr className="border-accent w-screen " />
            <button
              onClick={handleLogout}
              className="text-2xl text-red-500 hover:text-red-700 font-medium"
            >
              Sign Out
            </button>
          </nav>
        </header>
      )}
    </header>
  );
};

export default Header;
