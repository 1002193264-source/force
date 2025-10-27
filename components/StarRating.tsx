import React, { useState } from 'react';

interface StarRatingProps {
  count?: number;
  rating: number;
  onRate: (rating: number) => void;
  className?: string;
}

const Star: React.FC<{ filled: boolean; onMouseEnter: () => void; onClick: () => void; }> = ({ filled, onMouseEnter, onClick }) => (
    <svg
        onMouseEnter={onMouseEnter}
        onClick={onClick}
        className={`w-6 h-6 cursor-pointer transition-colors ${filled ? 'text-yellow-400' : 'text-black/30 hover:text-yellow-400'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.064 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
    </svg>
);


export const StarRating: React.FC<StarRatingProps> = ({ count = 5, rating, onRate, className="" }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const stars = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div className={`flex items-center ${className}`} onMouseLeave={() => setHoverRating(0)} role="radiogroup">
      {stars.map((starValue) => (
        <span key={starValue} role="radio" aria-checked={starValue === rating} tabIndex={0} aria-label={`${starValue} stars`}>
            <Star
                filled={starValue <= (hoverRating || rating)}
                onMouseEnter={() => setHoverRating(starValue)}
                onClick={() => onRate(starValue)}
            />
        </span>
      ))}
    </div>
  );
};