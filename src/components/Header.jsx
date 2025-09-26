import React from "react";
import header_logo from "../assets/header_logo.png";
import vertical_logo from "../assets/Vertical_logo.png";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll.jsx";

const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  useLockBodyScroll(isMenuOpen);
  const { logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 bg-background border-b border-secondary shadow-sm z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo (always left) */}
        <NavLink to="/" className="flex items-center">
          <img src={header_logo} alt="logo" width={150} className="h-auto" />
        </NavLink>

        {/* Desktop Navigation (≥ md) */}
        <div className="hidden lg:flex items-center space-x-8 text-accent font-medium">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "text-primary font-bold" : "hover:text-primary"
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/AidRequest"
            className={({ isActive }) =>
              isActive ? "text-primary font-bold" : "hover:text-primary"
            }
          >
            Aid Request
          </NavLink>
          <NavLink
            to="/DonationsAndVolunteers/donations"
            className={({ isActive }) =>
              isActive ? "text-primary font-bold" : "hover:text-primary"
            }
          >
            Reliefs
          </NavLink>
          <NavLink
            to="/OrgsAndSponsors/organizations"
            className={({ isActive }) =>
              isActive ? "text-primary font-bold" : "hover:text-primary"
            }
          >
            Organizations
          </NavLink>
          <NavLink
            to="/DisasterMap"
            className={({ isActive }) =>
              isActive ? "text-primary font-bold" : "hover:text-primary"
            }
          >
            Disaster Map
          </NavLink>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Sign Out
          </button>
        </div>

        {/* Mobile Menu Button (< lg) */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={toggleMenu}
            className="text-background bg-primary p-4 rounded-lg font-semibold"
          >
            Menu
          </button>
        </div>
      </nav>

      {/* Mobile Overlay Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-6 py-8 menu-overlay">
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

            {[
              { to: "/profile", label: "Profile" },
              { to: "/AidRequest", label: "Aid Request" },
              { to: "/DonationsAndVolunteers/donations", label: "Reliefs" },
              { to: "/OrgsAndSponsors/organizations", label: "Organizations" },
              { to: "/DisasterMap", label: "Disaster Map" },
            ].map((item) => (
              <React.Fragment key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={toggleMenu}
                  className="text-2xl text-primary hover:text-accent font-medium"
                >
                  {item.label}
                </NavLink>
                <hr className="border-accent w-screen" />
              </React.Fragment>
            ))}

            <button
              onClick={handleLogout}
              className="text-2xl text-red-500 hover:text-red-700 font-medium"
            >
              Sign Out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
