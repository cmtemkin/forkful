
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  inverted?: boolean;
}

const Logo = ({ className = '', size = 'medium', inverted = false }: LogoProps) => {
  const sizes = {
    small: 'h-6',
    medium: 'h-12',
    large: 'h-24'
  };
  
  const iconColor = inverted ? "text-primary-coral" : "text-white";
  const bgColor = inverted ? "bg-white" : "bg-primary-coral";
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${bgColor} rounded-full p-1 flex items-center justify-center ${sizes[size]}`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className={`${size === 'small' ? 'h-4 w-4' : sizes[size]} ${iconColor}`}
        >
          {/* Fork icon */}
          <path 
            d="M11 5V16M11 16C11 18.2091 9.20914 20 7 20H6M11 16C11 18.2091 12.7909 20 15 20H16M11 5C11 3.34315 12.3431 2 14 2C15.6569 2 17 3.34315 17 5V9C17 10.6569 15.6569 12 14 12H11" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {size !== 'small' && <span className="font-outfit font-bold text-2xl ml-3 text-gray-800">Forkful</span>}
    </div>
  );
};

export default Logo;
