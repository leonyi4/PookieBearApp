import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Donation Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Donation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow hover:shadow-md overflow-hidden">
            <img
              src="https://via.placeholder.com/400x200"
              alt="Donation 1"
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                “Clean Water for Shan Families” (Ongoing)
              </h3>
              <p className="mt-1 text-xs text-gray-600">
                Flash floods contaminated water sources in Shan State. Support
                provides filters, tanks, and hygiene kits for 200+ families.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow hover:shadow-md overflow-hidden">
            <img
              src="https://via.placeholder.com/400x200"
              alt="Donation 2"
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                “Rebuild a Classroom in Magway”
              </h3>
              <p className="mt-1 text-xs text-gray-600">
                Help rebuild a primary school destroyed by last year’s
                earthquake. Every donation helps kids return to learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fundraising Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Fundraising</h2>
        <div className="rounded-xl overflow-hidden shadow bg-green-100 h-28 flex items-center justify-center">
          <span className="text-green-700 font-semibold">
            🌱 Empower Communities
          </span>
        </div>
        <Link to="/StartFundraiser">
          <button className="mt-4 w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700">
            Start a Fundraiser
          </button>
        </Link>
      </section>

      {/* Organizations Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Organizations</h2>
        <ul className="space-y-3">
          <li className="flex items-center space-x-3">
            <img
              src="https://via.placeholder.com/40"
              alt="Bright Horizons"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-800">
                Bright Horizons Foundation
              </p>
              <p className="text-xs text-gray-500">#Disaster Relief Aid</p>
            </div>
          </li>
          <li className="flex items-center space-x-3">
            <img
              src="https://via.placeholder.com/40"
              alt="Good Shepherd"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-800">
                The Good Shepherd Mission
              </p>
              <p className="text-xs text-gray-500">#Following Christ</p>
            </div>
          </li>
          <li className="flex items-center space-x-3">
            <img
              src="https://via.placeholder.com/40"
              alt="Hope Bridge"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-800">
                Hope Bridge Foundation
              </p>
              <p className="text-xs text-gray-500">#Community Support</p>
            </div>
          </li>
        </ul>
      </section>

      {/* Sponsors Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Sponsored By:</h2>
        <div className="flex flex-wrap items-center gap-4">
          <img
            src="https://via.placeholder.com/50"
            alt="Sponsor 1"
            className="h-12 w-12 object-contain"
          />
          <img
            src="https://via.placeholder.com/50"
            alt="Sponsor 2"
            className="h-12 w-12 object-contain"
          />
          <img
            src="https://via.placeholder.com/50"
            alt="Sponsor 3"
            className="h-12 w-12 object-contain"
          />
          <img
            src="https://via.placeholder.com/50"
            alt="Sponsor 4"
            className="h-12 w-12 object-contain"
          />
          <img
            src="https://via.placeholder.com/50"
            alt="Sponsor 5"
            className="h-12 w-12 object-contain"
          />
        </div>
      </section>

      {/* Real Time Updates Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Real Time Updates</h2>
        <div className="rounded-xl overflow-hidden shadow">
          <img
            src="https://via.placeholder.com/600x250"
            alt="Disaster Map"
            className="w-full h-56 object-cover"
          />
        </div>
        <div className="mt-4 space-y-2">
          <Link to="/disasters">
            <button className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700">
              View Now
            </button>
          </Link>
          <button className="w-full bg-gray-800 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-900">
            Learn More About Us
          </button>
        </div>
      </section>
    </div>
  );
}
