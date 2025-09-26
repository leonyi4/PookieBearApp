const Button = ({ onClick, children, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-primary text-white px-4 py-2 sm:px-5 sm:py-3 rounded-md 
      hover:bg-secondary hover:text-accent 
      focus:outline-none focus:ring-2 focus:ring-primary transition
      ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
