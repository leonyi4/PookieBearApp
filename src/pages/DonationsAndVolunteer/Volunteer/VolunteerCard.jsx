import React from "react";
import { Link } from "react-router-dom";
import data from "../../../assets/test_data.json";

const VolunteerCard = (props) => {

  // console.log(props.data)


  const progress =
    (props.data.impact.volunteers_signed_up /
      props.data.impact.volunteers_needed) *
    100;

  // console.log(data);
  const org_id = props.data.org_id;
  const org_data = data.orgs.find((o) => o.id === org_id);
  // console.log(org_data);

  return (
    <div
      // to={`DonationsAndVolunteers/volunteers/${props.data.id}`}
      className={`bg-secondary rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col flex-shrink-0 ${props.className}`}
    >
      {/* Image */}
      <img
        className="w-full h-40 object-cover rounded-t-lg"
        src={props.data.image}
        alt={props.data.name}
      />

      {/* Content */}
      <div className="p-2 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
          {props.data.name}
        </h3>

        {/* Progress bar */}
        <div className="mt-auto">
          <p className="text-xs text-gray-700 m-1">
            {props.data.impact.volunteers_signed_up.toLocaleString()} signed up
            of {props.data.impact.volunteers_needed.toLocaleString()}
          </p>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="h-2 bg-primary rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-700 mt-1">
            Goal: {props.data.impact.volunteers_needed.toLocaleString()}{" "}
            volunteers
          </p>
        </div>

        {/* Organization Info */}
        {org_data && (
          <div className="flex items-center mt-2 mb-1">
            <img
              src={org_data.logo}
              alt={org_data.name}
              className="h-8 w-8 rounded-full mr-2"
            />
            <span className="text-sm font-medium text-gray-800">
              {org_data.name}
            </span>
          </div>
        )}

        {/* View Details and Share Buttons*/}
        {!props.home && (
        <div className="mt-2 flex space-x-2 justify-between text-center">
          <Link
            to={`/DonationsAndVolunteers/volunteers/${props.data.id}`}
            className="w-full bg-primary  text-white font-medium py-1 px-1 rounded-md hover:bg-accent"
          >
            <button className="">
              View Details
            </button>
          </Link>
          <button className="w-full bg-accent text-white font-medium py-1 px-1 rounded-md hover:bg-gray-400">
            Share
          </button>
        </div>
        )}
      </div>

      
    </div>
  );
};

export default VolunteerCard;
