import React from 'react'

const FundRaiserCard = (props) => {
  const { fundraiser } = props;

  
  const progress =
    Math.min((fundraiser.raised / fundraiser.goal) * 100, 100).toFixed(
      1
    );


  return (
    <div className="space-y-4 my-6 bg-secondary">
        
        {/* Title & Description */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 ">
            {fundraiser.name}
          </h2>
          <p className="text-gray-700 mt-1">{fundraiser.desc}</p>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>${fundraiser.raised.toLocaleString()} raised</span>
            <span>Goal: ${fundraiser.goal.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{progress}% funded</p>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Category:</span>{" "}
            {fundraiser.category}
          </div>
          <div>
            <span className="font-medium text-gray-700">Organization:</span>{" "}
            {fundraiser.organization}
          </div>
          <div>
            <span className="font-medium text-gray-700">Location:</span>{" "}
            {fundraiser.location}
          </div>
          <div>
            <span className="font-medium text-gray-700">Sponsors:</span>{" "}
            {fundraiser.sponsors && fundraiser.sponsors.length > 0
              ? fundraiser.sponsors.join(", ")
              : "None"}
          </div>
        </div>

        {/* Manage actions */}
        <div className="pt-4 flex space-x-3">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Share
          </button>
          <button className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200">
            Edit
          </button>
        </div>
      </div>
  )
}

export default FundRaiserCard