
import React, { useState } from 'react';

interface MealCardImageProps {
  image: string;
  title: string;
  className?: string;
}

const MealCardImage = ({ image, title, className = '' }: MealCardImageProps) => {
  const [hasError, setHasError] = useState(false);
  
  if (!image || hasError) {
    return null;
  }
  
  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export default MealCardImage;
