
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  inverted?: boolean;
}

const Logo = ({ className = '', size = 'medium', inverted = false }: LogoProps) => {
  const sizes = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-24 w-24'
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
          className={`${sizes[size]} ${iconColor}`}
        >
          <path 
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" 
            fill="currentColor"
          />
        </svg>
      </div>
      {size !== 'small' && <span className="font-outfit font-bold text-2xl ml-3 text-gray-800">Forkful</span>}
    </div>
  );
};

export default Logo;
