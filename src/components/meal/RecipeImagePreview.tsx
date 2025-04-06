
import React from 'react';

interface RecipeImagePreviewProps {
  imageUrl: string;
  title: string;
  onError: () => void;
}

const RecipeImagePreview = ({ imageUrl, title, onError }: RecipeImagePreviewProps) => {
  if (!imageUrl) return null;
  
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Recipe Image</label>
      <div className="w-full aspect-video max-w-xs mx-auto bg-gray-100 rounded-md overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title || "Recipe"} 
          className="w-full h-full object-cover"
          onError={onError}
        />
      </div>
    </div>
  );
};

export default RecipeImagePreview;
