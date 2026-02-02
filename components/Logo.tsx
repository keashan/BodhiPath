
import React, { useState } from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  const [imageError, setImageError] = useState(false);

  // Try to load the image from public folder first
  if (!imageError) {
    return (
      <img 
        src="/flower.png" 
        alt="BodhiPath Flower" 
        className={`object-contain ${className}`}
        onError={() => setImageError(true)} 
      />
    );
  }

  // Fallback to the SVG Flower if the image file is missing/broken
  return (
    <svg 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Stem */}
      <path d="M256 460V320" stroke="#4d7c0f" strokeWidth="12" strokeLinecap="round"/>
      <path d="M256 400C256 400 220 390 200 360" stroke="#4d7c0f" strokeWidth="12" strokeLinecap="round"/>
      <path d="M256 420C256 420 290 410 310 380" stroke="#4d7c0f" strokeWidth="12" strokeLinecap="round"/>
      
      {/* Back Petals */}
      <path d="M256 320C256 320 160 300 130 220C100 140 180 120 256 180C332 120 412 140 382 220C352 300 256 320 256 320Z" fill="#fed7aa" stroke="#fdba74" strokeWidth="4"/>
      
      {/* Main Petals */}
      <path d="M256 320C256 320 190 280 170 200C150 120 220 80 256 140C292 80 362 120 342 200C322 280 256 320 256 320Z" fill="#fdba74" stroke="#fb923c" strokeWidth="4"/>
      
      {/* Center Petal */}
      <path d="M256 320C256 320 220 250 220 180C220 110 256 60 256 60C256 60 292 110 292 180C292 250 256 320 256 320Z" fill="#fb923c" stroke="#f97316" strokeWidth="4"/>
      
      {/* Core */}
      <circle cx="256" cy="190" r="24" fill="#fff7ed" filter="url(#glow)"/>
      <circle cx="256" cy="190" r="12" fill="#ffedd5"/>
    </svg>
  );
};

export default Logo;
