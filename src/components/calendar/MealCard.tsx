
import React, { useState } from 'react';
import { Lock, ThumbsUp } from 'lucide-react';

interface MealCardProps {
  title: string;
  image?: string;
  upvotes: number;
  isLocked?: boolean;
}

const MealCard = ({ title, image, upvotes, isLocked }: MealCardProps) => {
  const [imageError, setImageError] = useState(false);
  
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
    <div className="relative w-full h-24 rounded-xl overflow-hidden shadow-sm">
      {image && !imageError ? (
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: generatePlaceholderColor(title) }}
        >
          <span className="text-lg font-medium text-white">{title.charAt(0)}</span>
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-medium text-lg">{title}</h3>
          
          <div className="flex items-center space-x-2">
            {upvotes > 0 && (
              <div className="flex items-center bg-white/20 text-white rounded-full px-2 py-0.5">
                <ThumbsUp className="h-3 w-3 mr-1" /> 
                <span className="text-xs">{upvotes}</span>
              </div>
            )}
            
            {isLocked && (
              <div className="bg-white/20 text-white rounded-full p-1">
                <Lock className="h-3 w-3" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
