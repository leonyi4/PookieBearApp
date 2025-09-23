import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../lib/supabase-client";

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setLoading(true);

        // Fetch volunteers with their linked organization
        const { data, error } = await supabase.from("volunteers").select(`
          id,
          name,
          description,
          image,
          impact,
          org_id,
          organizations:volunteers_org_id_fkey (
            id,
            name,
            logo
          )
        `);

        if (error) throw error;
        setVolunteers(data || []);
      } catch (err) {
        console.error("Error fetching volunteers:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-accent">
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Ongoing Volunteer Campaigns
      </h1>

      {volunteers.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {volunteers.map((relief) => {
            const signed = relief.impact?.volunteers_signed_up || 0;
            const needed = relief.impact?.volunteers_needed || 0;
            const progress =
              needed > 0 ? Math.min((signed / needed) * 100, 100) : 0;

            return (
              <div
                key={relief.id}
                className="bg-secondary border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col"
              >
                {/* Image */}
                {relief.image && (
                  <img
                    src={relief.image}
                    alt={relief.name}
                    className="h-40 w-full object-cover rounded-t-lg"
                  />
                )}

                {/* Content */}
                <div className="p-2 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {relief.name}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-1">
                    {relief.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-auto">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-black">Volunteers</p>
                      <p className="text-sm text-gray-700">
                        {signed.toLocaleString()} / {needed.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-700">
                      Goal: {needed.toLocaleString()} People
                    </p>
                  </div>

                  {/* Organization Info */}
                  {relief.organizations && (
                    <div className="flex items-center mb-1 mt-2">
                      <img
                        src={relief.organizations.logo}
                        alt={relief.organizations.name}
                        className="h-8 w-8 rounded-full mr-2"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        {relief.organizations.name}
                      </span>
                    </div>
                  )}

                  {/* View Details and Share */}
                  <div className="mt-2">
                    <Link to={`/volunteers/${relief.id}`}>
                      <button className="w-full bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-accent">
                        View Details
                      </button>
                    </Link>
                    <button className="mt-1 w-full bg-accent text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-400">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No relief campaigns found.</p>
      )}
    </div>
  );
};

export default Volunteers;
