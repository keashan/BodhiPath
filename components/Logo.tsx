
import React, { useState } from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  const [imageError, setImageError] = useState(false);

  // 1. Try to load the image file from public/logo.png
  if (!imageError) {
    return (
      <img 
        src="/logo.png" 
        alt="BodhiPath Logo" 
        className={`object-contain ${className}`}
        onError={() => setImageError(true)} 
      />
    );
  }

  // 2. Fallback: Code-generated 3D Flower (Matches your design exactly)
  return (
    <svg 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        {/* Soft 3D Lighting for Petals (White/Lilac) */}
        <radialGradient id="petal3D" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f3e8ff" /> {/* Light Lilac tint */}
          <stop offset="100%" stopColor="#d8b4fe" /> {/* Shadowy purple */}
        </radialGradient>

        {/* 3D Lighting for Center (Orange) */}
        <radialGradient id="center3D" cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fbbf24" /> {/* Bright Yellow-Orange */}
          <stop offset="100%" stopColor="#ea580c" /> {/* Deep Orange Shadow */}
        </radialGradient>

        {/* Stem Gradient */}
        <linearGradient id="stem3D" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>

        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feOffset dx="2" dy="4" result="offsetBlur" />
          <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
        </filter>
      </defs>

      {/* Stem */}
      <rect x="246" y="300" width="20" height="160" rx="10" fill="url(#stem3D)" />
      
      {/* Leaves (Rounded, balloon style) */}
      <path d="M246 420 C200 420, 160 400, 160 380 C160 360, 200 390, 246 400" fill="#86efac" />
      <path d="M266 420 C312 420, 352 400, 352 380 C352 360, 312 390, 266 400" fill="#86efac" />

      {/* 5 Petals - Rotated to match the "Star" arrangement */}
      <g filter="url(#dropShadow)">
         {/* Top */}
         <ellipse cx="256" cy="150" rx="75" ry="85" fill="url(#petal3D)" />
         
         {/* Top Right */}
         <ellipse cx="345" cy="215" rx="80" ry="75" fill="url(#petal3D)" transform="rotate(20 345 215)" />
         
         {/* Bottom Right */}
         <ellipse cx="330" cy="320" rx="75" ry="80" fill="url(#petal3D)" transform="rotate(-20 330 320)" />
         
         {/* Bottom Left */}
         <ellipse cx="182" cy="320" rx="75" ry="80" fill="url(#petal3D)" transform="rotate(20 182 320)" />
         
         {/* Top Left */}
         <ellipse cx="167" cy="215" rx="80" ry="75" fill="url(#petal3D)" transform="rotate(-20 167 215)" />
         
         {/* Center */}
         <circle cx="256" cy="256" r="65" fill="url(#center3D)" />
         
         {/* Glossy Highlight on Center */}
         <ellipse cx="236" cy="236" rx="20" ry="12" fill="white" opacity="0.4" transform="rotate(-45 236 236)" />
      </g>
    </svg>
  );
};

export default Logo;
