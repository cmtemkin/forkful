
import React, { useState } from 'react';
import { ImageIcon, Camera } from 'lucide-react';

interface RecipeImagePreviewProps {
  imageUrl: string;
  title: string;
  onError: () => void;
}

const RecipeImagePreview = ({ imageUrl, title, onError }: RecipeImagePreviewProps) => {
  const [hasError, setHasError] = useState(false);
  
  const handleError = () => {
    setHasError(true);
    onError();
  };
  
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
    <div className="w-full aspect-video max-w-xs mx-auto bg-gray-100 rounded-md overflow-hidden">
      {!imageUrl || hasError ? (
        <div 
          className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
          style={{ backgroundColor: generatePlaceholderColor(title || 'Recipe') }}
        >
          <Camera className="h-10 w-10 text-gray-500 mb-2" />
          <span className="text-sm font-medium text-gray-700 break-words">
            Click to add image
          </span>
        </div>
      ) : (
        <img 
          src={imageUrl} 
          alt={title || "Recipe"} 
          className="w-full h-full object-cover"
          onError={handleError}
        />
      )}
    </div>
  );
};

export default RecipeImagePreview;
