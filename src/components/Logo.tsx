
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  inverted?: boolean;
}

const Logo = ({ className = '', size = 'medium', inverted = false }: LogoProps) => {
  const sizes = {
    small: 'h-8',
    medium: 'h-12',
    large: 'h-24'
  };
  
  const iconColor = inverted ? "text-[#FF7A5A]" : "text-white";
  const bgColor = inverted ? "bg-white" : "bg-[#FF7A5A]";
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${bgColor} rounded-2xl p-4 ${sizes[size]}`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className={`${sizes[size]} ${iconColor}`}
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
      <span className="font-outfit font-bold text-2xl ml-3 text-gray-800">Forkful</span>
    </div>
  );
};

export default Logo;
