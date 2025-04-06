
import React from 'react';
import { Plus } from 'lucide-react';

interface MealImageSectionProps {
  image: string | undefined;
  title: string;
}

const MealImageSection = ({ image, title }: MealImageSectionProps) => {
  return (
    <div className="relative w-full rounded-xl overflow-hidden aspect-video bg-gray-100">
      {image ? (
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
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
