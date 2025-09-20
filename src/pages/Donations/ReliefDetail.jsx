import data from "../../assets/test_data.json";
import { useParams, useNavigate } from "react-router-dom";
import RatingStars from "../../components/RatingStars";

export default function ReliefDetail() {
  // ⚡ Mock data — replace with real API later

  const relief_id = useParams();
  const navigate = useNavigate();

  // Get Campaign Data
  const campaign = data.relief_data.find(
    (r) => r.id === parseInt(relief_id.reliefId)
  );

  // Calculate Campaign Goal Progress Percentage
  const progress = Math.min(
    (campaign.raised / campaign.goal) * 100,
    100
  ).toFixed(0);

  // Get Organization Data
  const org = campaign["org_id"];
  const orgData = data.orgs.find((o) => o.id === org);

  // Calculate Budget Allocation Percentages
  const total_budget = Object.values(campaign.budget_allocation).reduce(
    (a, b) => a + b,
    0
  );
  // calculate the percentage for each allocation into a new object
  const budget_allocation_percentage = {};

  for (let key in campaign.budget_allocation) {
    var value = campaign.budget_allocation[key];
    var percentage = Math.round((value / total_budget) * 100, 2);

    budget_allocation_percentage[key] = {
      percentage: percentage,
      value: value,
    };
  }

  // for each entry in budget_allocation_percentage, log the key and value
  // Object.entries(budget_allocation_percentage).map(([key, value]) => {
  //   console.log(key, value.percentage, value.value);
  // });

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div>
        {/* Back Button and Relief Title*/}

        <div className="flex items-center space-x-4 p-6">
          <button
            onClick={() => navigate(-1)}
            className="text-primary text-lg hover:text-accent"
          >
            &larr;
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {campaign.name}
          </h2>
        </div>
      </div>
      {/* Hero Image */}
      <img
        src={campaign.image}
        alt={campaign.title}
        className="w-full h-56 object-cover"
      />

      <div className="p-6 space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>

        {/* Organization Info */}
        <div className="flex items-center space-x-3">
          <img
            src={orgData.logo}
            alt={orgData.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="font-medium text-gray-800">{orgData.name}</p>
            <p className="text-xs text-gray-500">{orgData.tags}</p>
          </div>
        </div>

        {/* Ratings */}
        <div className="grid grid-cols-2 gap-3 text-accent">
          <button className="flex flex-col space-y-2 items-center justify-center space-x-1 border rounded-lg py-2">
            <span className="text-sm font-medium">Public Rating</span>
            <RatingStars
              rating={orgData.ratings.ai_rating}
              maxStars={5}
              className=""
            />
          </button>
          <button className="flex  flex-col space-y-2 items-center justify-center space-x-1 border rounded-lg py-2">
            <span className="text-sm font-medium ">AI Rating</span>
            <RatingStars
              rating={orgData.ratings.public_rating}
              maxStars={5}
              className=""
            />
          </button>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1 text-black">
            <span>
              Raised:{" "}
              <span className="font-semibold text-gray-800">
                {campaign.raised.toLocaleString()} Kyats
              </span>
            </span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Goal: {campaign.goal.toLocaleString()} Kyats
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm leading-relaxed">
          {campaign.description}
        </p>

        {/* CTA */}
        <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-accent">
          Donate Now
        </button>

        {/* How Your Donation Helps */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            How Your Donation Helps
          </h2>
          <div className="space-y-3">
            {campaign.contributions.map((item, idx) => (
              <div key={idx} className="flex space-x-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Allocation */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Budget Allocation
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            Total: {total_budget} Kyats
          </p>
          <div className="space-y-2 text-black">
            {Object.entries(budget_allocation_percentage).map(
              ([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{key}</span>
                    <span>{value.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full"
                      style={{ width: `${value.percentage}%` }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
