import React from "react";

const Button = (props) => {
  return (
    <button
      onClick={props.onClick}
      className="bg-primary text-white px-5 py-3 rounded-md text-white
      hover:text-gray-900 hover:bg-secondary
      focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {props.children}
    </button>
  );
};

export default Button;
