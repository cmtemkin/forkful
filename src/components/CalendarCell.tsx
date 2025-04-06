
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Lock, ImageIcon } from 'lucide-react';

interface CalendarCellProps {
  mealId?: string;
  title?: string;
  image?: string;
  isLocked?: boolean;
  day: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
}

const CalendarCell = ({
  mealId,
  title,
  image,
  isLocked = false,
  day,
  mealType
}: CalendarCellProps) => {
  const [imageError, setImageError] = useState(false);
  
  const generatePlaceholderColor = (title: string) => {
    // Generate a deterministic color based on the title
    let hash = 0;
    for (let i = 0; i < title?.length || 0; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate hue (0-360), high saturation and light
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 80%)`;
  };
  
  if (!mealId) {
    return (
      <Link 
        to={`/add-meal?day=${day}&mealType=${mealType}`}
        className="border border-gray-200 h-24 flex flex-col items-center justify-center text-sm text-gray-500 hover:bg-gray-50"
      >
        <Plus className="h-5 w-5 mb-1" />
        <span>Add meal</span>
      </Link>
    );
  }

  return (
    <Link 
      to={`/meal/${mealId}`}
      className="border border-gray-200 h-24 flex flex-col relative overflow-hidden"
    >
      {image && !imageError ? (
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div 
          className="w-full h-full flex flex-col items-center justify-center p-2"
          style={{ backgroundColor: generatePlaceholderColor(title || 'Meal') }}
        >
          <ImageIcon className="h-6 w-6 text-white/70 mb-1" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-2">
        <div className="flex justify-between items-start">
          <span className="text-xs font-medium text-white">{title}</span>
          {isLocked && (
            <Lock className="h-4 w-4 text-white" />
          )}
        </div>
      </div>
    </Link>
  );
};

export default CalendarCell;
