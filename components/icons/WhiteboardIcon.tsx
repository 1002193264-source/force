
import React from 'react';

export const WhiteboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <rect x="3" y="3" width="18" height="12" rx="2" ry="2" />
    <line x1="12" y1="15" x2="12" y2="21" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <path d="M7 8h10" />
    <path d="M7 11h6" />
  </svg>
);
