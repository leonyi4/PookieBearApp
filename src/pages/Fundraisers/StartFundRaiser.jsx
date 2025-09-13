import { useState } from "react";

export default function StartFundraiser() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    goal: "",
    category: "",
    organization: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 🚀 TODO: hook this up to backend or state
    console.log("Form submitted:", formData);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-black mb-6">
        Start a Fundraiser
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fundraiser Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border-black border text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full rounded-md border-black border text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        {/* Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Goal Amount ($)
          </label>
          <input
            type="number"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            required
            className="w-full rounded-md border-black border text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full rounded-md border-black border text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category</option>
            <option value="medical">Medical</option>
            <option value="housing">Housing</option>
            <option value="food">Food</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Related Organization */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Related Organization
          </label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder="Optional"
            className="w-full rounded-md border-black border text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Location (map placeholder) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Disaster Location
          </label>
          <div className="w-full h-64 rounded-md border border-black border text-black flex items-center justify-center bg-gray-100 text-gray-500">
            {/* In a real app, embed a map here (Leaflet / Google Maps / Mapbox) */}
            <span>📍 Map Placeholder — select location</span>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Fundraiser
          </button>
        </div>
      </form>
    </div>
  );
}
