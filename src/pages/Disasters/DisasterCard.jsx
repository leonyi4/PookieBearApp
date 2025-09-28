import { Link } from "react-router-dom";

const DisasterCard = ({ disaster }) => {
  return (
    <div className="bg-secondary rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
      {/* Content Row */}
      <div className="flex flex-col sm:flex-row">
        {disaster.image && (
          <img
            src={disaster.image}
            alt={disaster.name}
            className="w-full sm:w-32 h-40 sm:h-auto object-cover"
          />
        )}

        <div className="flex-1 p-3 flex flex-col">
          <h2 className="font-bold text-gray-900 text-base sm:text-lg uppercase line-clamp-1">
            {disaster.name}
          </h2>
          <div className="flex justify-between items-center text-xs sm:text-sm mt-1">
            <p className="text-gray-500">
              {new Date(disaster.date).toLocaleDateString()}
            </p>
            <p className="font-bold text-accent">
              Severity:{" "}
              {disaster.severity === "High" ? (
                <span className="text-red-600">High</span>
              ) : disaster.severity === "Moderate" ? (
                <span className="text-yellow-600">Moderate</span>
              ) : (
                <span className="text-green-600">Low</span>
              )}
            </p>
          </div>
          <p className="text-gray-700 text-sm line-clamp-3 mt-2 flex-1">
            {disaster.description}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-3 pb-3 mt-2">
        <Link to={`/DisasterMap/${disaster.id}`}>
          <button className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-accent transition">
            View Events
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DisasterCard;
