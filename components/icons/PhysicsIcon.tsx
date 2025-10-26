
import React from 'react';

export const PhysicsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="5" rx="10" ry="3" transform="rotate(45 12 5)" />
    <ellipse cx="12" cy="5" rx="10" ry="3" transform="rotate(-45 12 5)" />
    <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path d="M12 12v3" />
    <path d="M12 12h3" />
    <path d="m12 12-3-3" />
  </svg>
);
