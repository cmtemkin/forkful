
import React, { useState } from 'react';
import { Utensils } from 'lucide-react';

interface MealImageSectionProps {
  image: string | undefined;
  title: string;
}

const MealImageSection = ({ image, title }: MealImageSectionProps) => {
  const [hasError, setHasError] = useState(false);
  
  // If no image, don't show anything
  if (!image || hasError) {
    return null;
  }
  
  return (
    <div className="relative w-full rounded-xl overflow-hidden aspect-video bg-gray-100">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default MealImageSection;
