import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="Listening2Go Logo"
    >
      {/* Background Bubble (Text/Script representation) - Slate */}
      <path 
        d="M6 20C6 14.4772 10.4772 10 16 10H38C43.5228 10 48 14.4772 48 20V40C48 45.5228 43.5228 50 38 50H18L6 58V20Z" 
        className="fill-slate-700 dark:fill-slate-600" 
      />
      <path 
        d="M16 22H38M16 30H30" 
        className="stroke-slate-400 dark:stroke-slate-400" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />

      {/* Foreground Bubble (Audio representation) - Blue */}
      <path 
        d="M26 24C26 18.4772 30.4772 14 36 14H54C59.5228 14 64 18.4772 64 24V44C64 49.5228 59.5228 54 54 54H42L32 62V54H36C30.4772 54 26 49.5228 26 44V24Z" 
        className="fill-blue-600" 
        stroke="white" 
        strokeWidth="2"
      />
      
      {/* Sound Waves Icon */}
      <path 
        d="M40 32V36M45 27V41M50 30V38" 
        stroke="white" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
    </svg>
  );
};