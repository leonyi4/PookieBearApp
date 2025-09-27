import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-6">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-lg text-accent mb-6">
        Oops! The page you are looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-accent transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
