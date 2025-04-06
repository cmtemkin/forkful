
import React, { useState, useRef } from 'react';
import { ImageIcon, Utensils } from 'lucide-react';

interface RecipeImagePreviewProps {
  imageUrl: string;
  title: string;
  onError: () => void;
  onImageSelected?: (file: File) => void;
}

const RecipeImagePreview = ({ imageUrl, title, onError, onImageSelected }: RecipeImagePreviewProps) => {
  const [hasError, setHasError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageSelected) {
      // Create a new FileReader to read the file
      const reader = new FileReader();
      
      // Set up the onload handler
      reader.onload = (event) => {
        if (event.target?.result) {
          // Pass the file to the parent component
          onImageSelected(file);
        }
      };
      
      // Read the file as a data URL
      reader.readAsDataURL(file);
    }
  };
  
  // Use placeholder images if we hit an error or no image is provided
  const usePlaceholder = !imageUrl || hasError;
  
  return (
    <div 
      className="w-full aspect-video max-w-xs mx-auto bg-gray-100 rounded-md overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />
      
      {usePlaceholder ? (
        <div 
          className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
          style={{ backgroundColor: generatePlaceholderColor(title || 'Recipe') }}
        >
          <Utensils className="h-10 w-10 text-gray-500 mb-2" />
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
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
};

export default RecipeImagePreview;
