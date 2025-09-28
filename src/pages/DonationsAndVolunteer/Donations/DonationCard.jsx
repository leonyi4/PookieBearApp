import { Link } from "react-router-dom";
import ShareButton from "../../../components/ShareButton";

const DonationCard = ({ data: donation, home: isHome, className = "" }) => {
  const progress = (donation.raised / donation.goal) * 100;
  const org = donation.organization;

  return (
    <div
      className={`bg-secondary border rounded-xl shadow-md hover:shadow-lg transition flex flex-col ${className}`}
    >
      <img
        src={donation.image}
        alt={donation.name}
        className="h-36 sm:h-44 lg:h-56 w-full object-cover rounded-t-xl"
      />

      <div className="p-3 flex flex-col flex-1">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 min-h-[40px]">
          {donation.name}
        </h2>

        {!isHome && (
          <p className="text-sm text-gray-600 line-clamp-2 my-2">
            {donation.description}
          </p>
        )}

        {/* Progress */}
        <div className="mt-auto">
          <div className="flex justify-between text-xs sm:text-sm text-accent">
            <span>Raised</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-background rounded-full h-2 mt-1">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Goal: {donation.goal.toLocaleString()} Ks
          </p>
        </div>

        {/* Org */}
        {org && (
          <div className="flex items-center mt-2">
            <img
              src={org.logo}
              alt={org.name}
              className="h-8 w-8 rounded-full mr-2"
            />
            <span className="text-sm font-medium">{org.name}</span>
          </div>
        )}

        {/* Buttons */}
        {!isHome && (
          <div className="mt-3 flex gap-2">
            <Link
              to={`/DonationsAndVolunteers/donations/${donation.id}`}
              className="w-1/2"
            >
              <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-accent">
                View Details
              </button>
            </Link>
            <ShareButton
              url={`${window.location.origin}/DonationsAndVolunteers/donations/${donation.id}`}
              title={donation.name}
              className="w-1/2"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationCard;
