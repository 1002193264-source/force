import React from 'react';

export const InteractionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    {...props}
    xmlns="http://www.w3.org/2000/svg"  
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round">
    <circle cx="6" cy="6" r="3"></circle>
    <circle cx="18" cy="18" r="3"></circle>
    <line x1="8.59" y1="8.59" x2="15.41" y2="15.41"></line>
    <polyline points="14 6 18 6 18 10"></polyline>
    <polyline points="10 18 6 18 6 14"></polyline>
  </svg>
);
