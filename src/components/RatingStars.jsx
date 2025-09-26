import { Star, StarHalf } from "lucide-react";

const RatingStars = ({ rating = 0, maxStars = 5, className = "" }) => {
  return (
    <div className={`flex space-x-0.5 sm:space-x-1 ${className}`}>
      {[...Array(maxStars)].map((_, i) => {
        const diff = rating - i;
        if (diff >= 1) {
          return (
            <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-primary text-primary" />
          );
        } else if (diff > 0) {
          return (
            <StarHalf key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-primary text-primary" />
          );
        } else {
          return <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />;
        }
      })}
    </div>
  );
};

export default RatingStars;
