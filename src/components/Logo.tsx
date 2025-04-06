
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const Logo = ({ className = '', size = 'medium' }: LogoProps) => {
  const sizes = {
    small: 'h-8',
    medium: 'h-12',
    large: 'h-24'
  };
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`bg-chow-primary rounded-2xl p-4 ${sizes[size]}`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className={`${sizes[size]} text-white`}
        >
          <path 
            d="M5.5 3C5.5 2.44772 5.94772 2 6.5 2H9.5C10.0523 2 10.5 2.44772 10.5 3V21C10.5 21.5523 10.0523 22 9.5 22H6.5C5.94772 22 5.5 21.5523 5.5 21V3Z" 
            fill="currentColor" 
          />
          <path 
            d="M13.5 3C13.5 2.44772 13.9477 2 14.5 2H17.5C18.0523 2 18.5 2.44772 18.5 3V21C18.5 21.5523 18.0523 22 17.5 22H14.5C13.9477 22 13.5 21.5523 13.5 21V3Z" 
            fill="currentColor" 
          />
          <path 
            d="M21.5 3C21.5 2.44772 21.9477 2 22.5 2H25.5C26.0523 2 26.5 2.44772 26.5 3V21C26.5 21.5523 26.0523 22 25.5 22H22.5C21.9477 22 21.5 21.5523 21.5 21V3Z" 
            fill="currentColor" 
          />
        </svg>
      </div>
      <span className="font-bold text-2xl mt-2 text-gray-800">ChowDown</span>
    </div>
  );
};

export default Logo;
