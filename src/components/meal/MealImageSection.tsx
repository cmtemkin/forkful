
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface MealImageSectionProps {
  image: string | undefined;
  title: string;
}

const MealImageSection = ({ image, title }: MealImageSectionProps) => {
  const [hasError, setHasError] = useState(false);
  
  const generatePlaceholderColor = (title: string) => {
    // Generate a deterministic color based on the title
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate hue (0-360), high saturation and light
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 80%)`;
  };
  
  return (
    <div className="relative w-full rounded-xl overflow-hidden aspect-video bg-gray-100">
      {image && !hasError ? (
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: generatePlaceholderColor(title || 'Recipe') }}
        >
          <div className="text-gray-400 flex flex-col items-center">
            <Plus className="h-8 w-8 mb-2" />
            <span>No image available</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealImageSection;
