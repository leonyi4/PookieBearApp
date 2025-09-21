// src/pages/Organizations/OrgDetail.jsx
import React, { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import data from "../../assets/test_data.json";
import { Star, StarHalf } from "lucide-react";
import DisasterCard from "../Disasters/DisasterCard";
import RatingStars from "../../components/RatingStars";

export default function OrgDetail() {
  const { orgId } = useParams();
  const navigate = useNavigate();

  // get org data
  const org = data.orgs[orgId - 1] || null;

  // get relief data
  const ongoingReliefData = org.ongoing
    ? org.ongoing.map(
        (reliefId) => data.relief_data.find((r) => r.id === reliefId) || null
      )
    : [];

  // get past relief campaigns from org.reliefs by filtering out ongoing ones
  const pastReliefData = org.reliefs
    ? org.reliefs
        .filter((reliefId) => !org.ongoing.includes(reliefId))
        .map(
          (reliefId) => data.relief_data.find((r) => r.id === reliefId) || null
        )
    : [];

  // console.log(org.achievements)
  org.achievements.map((item) => console.log(item));

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-black">
      {/* Header */}
      <div>
        {/* Back Button and Relief Title*/}

        <div className="flex items-center space-x-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="text-primary text-lg hover:text-accent"
          >
            &larr;
          </button>
          <h1 className="text-xl uppercase font-bold text-accent">
            {org.name}
          </h1>
        </div>
        <img
          src={org.logo}
          alt={org.name}
          className="h-25 w-25 flex items-center mx-auto justify-center rounded-md"
        />
      </div>

      {/* About */}
      <section>
        <h2 className="font-semibold mb-2">About Us</h2>
        <p className="text-gray-600 text-sm">{org.about_us}</p>
      </section>

      {/* Ratings */}
      <section>
        <h2 className="font-semibold mb-2">Ratings</h2>

        <div className="flex flex-col items-start w-full text-accent ">
          <div
            className="my-2 w-full flex p-2 bg-background flex-col space-y-2 
          items-start justify-center space-x-1 border rounded-lg py-2"
          >
            <span className="text-sm font-medium ">AI Credibility Rating</span>
            <RatingStars
              rating={org.ratings.ai_rating}
              maxStars={5}
              className=""
            />
          </div>
          <div
            className="my-2 w-full flex flex-col p-2 bg-background space-y-2 items-start 
          justify-center space-x-1 border rounded-lg py-2"
          >
            <span className="text-sm font-medium">Public Rating</span>
            <RatingStars
              rating={org.ratings.public_rating}
              maxStars={5}
              className=""
            />
          </div>
        </div>
      </section>

      {/* Ongoing Reliefs */}

      <section>
        <h2 className="font-semibold mb-2">Ongoing Campaigns</h2>
        {ongoingReliefData.length > 0 ? (
          <div className="flex overflow-x-auto w-full overflow-y-hidden space-x-4 pb-2">
            {ongoingReliefData.map((disaster, index) => (
              <DisasterCard key={index} data={disaster} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No ongoing campaigns.</p>
        )}
      </section>

      {/* Impact */}
      <section>
        <h2 className="font-semibold mb-2">Our Impact</h2>
        <div className="flex space-y-3 space-x-3 w-fit flex-wrap">
          {Object.entries(org.impact).map(([key, item], idx) => (
            <div key={idx} className=" my-2 text-center text-white">
              <div className="border text-xs shadow p-1 bg-primary border-accent rounded-md">
                <p className="text-sm font-bold">{item}</p>
                <p>{key} </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tracker */}
      <section>
        <h2 className="font-semibold mb-2">Achievements</h2>
        {/* display every achievements */}

        {org.achievements.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col my-2 items-start justify-center px-2 py-1 border rounded-lg bg-secondary"
          >
            <div className="flex w-full justify-between">
              <p className="font-medium text-md text-white">{item.title}</p>
              <p className="text-accent text-sm font-sm">{item.year}</p>
            </div>
            <hr className="border-accent w-full" />
            <p className="text-accent text-sm">{item.description}</p>
          </div>
        ))}
      </section>

      {/* Past relief campaigns */}
      <section>
        <h2 className="font-semibold mb-2">Past Relief Campaigns</h2>
        {pastReliefData.length > 0 ? (
          <div className="flex overflow-x-auto overflow-y-hidden space-x-4 pb-2">
            {pastReliefData.map((disaster, index) => (
              <DisasterCard key={index} data={disaster} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No past relief campaigns.</p>
        )}
      </section>
    </div>
  );
}