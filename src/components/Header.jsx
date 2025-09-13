import React from "react";
import header_logo from "../assets/header_logo.png";
import { Link } from "react-router-dom";
import vertical_logo from "../assets/Vertical_logo.png";
import Button from "./Button.jsx";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky  bg-white border-accent shadow-sm">
      {/* Default Header */}
      {!isMenuOpen && (
        <header className="sticky bg-white border-b border-accent shadow-sm z-10">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-6">
            <Link to="/">
              <img src={header_logo} alt="logo" width={150} />
            </Link>
            <Button type="button" onClick={setIsMenuOpen}>
              Menu
            </Button>
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

          <nav className="space-y-6 text-center flex flex-col items-center">
            <Link to="/" onClick={toggleMenu}>
              <img src={vertical_logo} alt="logo" width={200} />
            </Link>
            <Link
              to="/"
              onClick={toggleMenu}
              className="text-2xl text-primary hover:text-accent font-medium"
            >
              Home
            </Link>
            <hr className="border-accent w-screen" />
            <Link
              to="/DisasterMap"
              onClick={toggleMenu}
              className="text-2xl text-primary hover:text-accent font-medium"
            >
              Disaster Map
            </Link>
            <hr className="border-accent w-screen" />
            <Link
              to="/Donations"
              onClick={toggleMenu}
              className="text-2xl text-primary hover:text-accent font-medium"
            >
              Donations
            </Link>
            <hr className="border-accent w-screen" />
            <Link
              to="/Organizations"
              onClick={toggleMenu}
              className="text-2xl text-primary hover:text-accent font-medium"
            >
              Organizations
            </Link>
            <hr className="border-accent w-screen " />
            <Link
              to="/Sponsors"
              onClick={toggleMenu}
              className="text-2xl text-primary hover:text-accent font-medium"
            >
              Sponsors
            </Link>
            <hr className="border-accent w-screen" />
            <Link
              to="/StartFundRaiser"
              onClick={toggleMenu}
              className="text-2xl text-primary hover:text-accent font-medium"
            >
              Start Fundraiser
            </Link>
          </nav>
          <hr className="border-accent w-screen " />
        </div>
      )}
    </header>
  );
};

export default Header;
