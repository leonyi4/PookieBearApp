import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase} from '../../../lib/supabase-client'

const Organizations = () => {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("organizations")
          .select("id, name, logo, description, ratings, ");

        if (error) throw error;
        setOrgs(data || []);
      } catch (err) {
        console.error("Error fetching organizations:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 bg-background min-h-screen">
      <h1 className="text-2xl font-bold text-accent mb-6">
        Partner Organizations
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading organizations…</p>
      ) : orgs.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {orgs.map((org) => (
            <Link
              key={org.id}
              to={`/organizations/${org.id}`}
              className="bg-white border border-secondary rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col"
            >
              {org.logo && (
                <img
                  src={org.logo}
                  alt={org.name}
                  className="h-40 w-full object-cover rounded-t-xl"
                />
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-semibold text-accent mb-2">
                  {org.name}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                  {org.desc}
                </p>
                <div className="mt-auto flex items-center justify-between text-sm">
                  <span className="text-primary font-medium">
                    {org.ongoing?.length || 0} Ongoing Reliefs
                  </span>
                  <span className="text-gray-500">
                    ⭐ {org.ratings?.public_rating?.toFixed(1) || "N/A"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No organizations found.</p>
      )}
    </div>
  );
};

export default Organizations;
