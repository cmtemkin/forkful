
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Lock } from 'lucide-react';

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
      <img 
        src={image || "/placeholder.svg"} 
        alt={title}
        className="w-full h-full object-cover"
      />
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
