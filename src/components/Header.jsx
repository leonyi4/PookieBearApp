import React from "react";
import header_logo from "../assets/header_logo.png";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky  bg-white border-b border-gray-200 shadow-sm">
      {/* Default Header */}
      {!isMenuOpen && (
        <header className="sticky bg-white border-b border-gray-200 shadow-sm z-10">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-6">
            <img src={header_logo} alt="logo" width={150} />
            <button
              type="button"
              onClick={setIsMenuOpen}
              className="p-2 rounded-md text-white bg-blue-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Menu
            </button>
          </nav>
        </header>
      )}



      {/* Drop Down Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center px-6 py-8">
          <button
            onClick={toggleMenu}
            className="absolute top-6 right-6 text-gray-600 hover:text-red-500 text-xl font-bold"
          >
            ✕
          </button>

          <nav className="space-y-6 text-center flex flex-col">
            <NavLink
              to="/"
              onClick={toggleMenu}
              className="text-2xl text-gray-800 hover:text-blue-600 font-medium"
            >
              Home
            </NavLink>
            <hr className="border-gray-300 w-screen" />
            <NavLink
              to="/DisasterMap"
              onClick={toggleMenu}
              className="text-2xl text-gray-800 hover:text-blue-600 font-medium"
            >
              Disaster Map
            </NavLink>
            <hr className="border-gray-300 w-screen" />
            <NavLink
              to="/Donations"
              onClick={toggleMenu}
              className="text-2xl text-gray-800 hover:text-blue-600 font-medium"
            >
              Donations
            </NavLink>
            <hr className="border-gray-300 w-screen" />
            <NavLink
              to="/Organizations"
              onClick={toggleMenu}
              className="text-2xl text-gray-800 hover:text-blue-600 font-medium"
            >
              Organizations
            </NavLink>
            <hr className="border-gray-300 w-screen " />
            <NavLink
              to="/Sponsors"
              onClick={toggleMenu}
              className="text-2xl text-gray-800 hover:text-blue-600 font-medium"
            >
              Sponsors
            </NavLink>
          </nav>
        </div>
      )}

    </header>
  );
};

export default Header;
