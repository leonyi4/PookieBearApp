import { Link } from "react-router-dom";

export default function AidRequestSubmitted() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4 py-8">
      {/* Logo */}
      <div className="mb-6">
        <img
          src="/Vertical_logo.png"
          alt="Pookie Bear"
          className="h-60 mt-12 sm:h-56 md:h-72 lg:h-80 w-auto mx-auto"
        />
      </div>

      {/* App Title */}

      {/* Confirmation message */}
      <div className="bg-primary text-white text-base sm:text-lg font-semibold px-6 py-3 rounded-full shadow-md mb-4 max-w-sm w-full">
        Help request received
      </div>

      {/* Subtext */}
      <p className="text-accent mb-8 text-xs sm:text-sm md:text-base border-b-2 border-primary py-2">
        Stay strong — you're not alone
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs sm:max-w-sm">
        <Link to="/Profile" state={{ tab: "aid" }}>
          <button className="w-full bg-accent hover:bg-secondary text-background font-medium py-2 sm:py-3 rounded-lg transition">
            View the Status
          </button>
        </Link>
        <Link to="/">
          <button className="w-full bg-secondary hover:bg-gray-300 text-accent font-medium py-2 sm:py-3 rounded-lg transition">
            Go to Home Page
          </button>
        </Link>
      </div>
    </div>
  );
}
