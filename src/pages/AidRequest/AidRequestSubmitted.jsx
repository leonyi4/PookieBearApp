import { Link } from "react-router-dom";
import Vertical_Logo from "../../assets/Vertical_logo.png";

export default function AidRequestSubmitted() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4 py-8">
      {/* Logo */}
      <div className="mb-6">
        <img
          src={Vertical_Logo}
          alt="Pookie Bear"
          className="h-40 sm:h-56 md:h-72 lg:h-80 w-auto mx-auto"
        />
      </div>

      {/* App Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">
        POOKIE
      </h1>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-8">
        BEAR
      </h1>

      {/* Confirmation message */}
      <div className="bg-primary text-white text-base sm:text-lg font-semibold px-6 py-3 rounded-full shadow-md mb-4 max-w-sm w-full">
        Help request received
      </div>

      {/* Subtext */}
      <p className="text-accent mb-8 text-xs sm:text-sm md:text-base">
        Stay strong — you're not alone
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs sm:max-w-sm">
        <Link to="/Profile" state={{ tab: "aid" }}>
          <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 sm:py-3 rounded-lg transition">
            View the Status
          </button>
        </Link>
        <Link to="/">
          <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 sm:py-3 rounded-lg transition">
            Go to Home Page
          </button>
        </Link>
      </div>
    </div>
  );
}
