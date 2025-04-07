
import React from 'react';
import { Clock, Coffee, UtensilsCrossed } from 'lucide-react';

interface MealBadgesProps {
  day?: string;
  mealType?: string;
  dayBadge?: React.ReactNode;
  mealTypeBadge?: React.ReactNode;
}

// Function to get meal type icon
export const getMealTypeIcon = (mealType: string) => {
  switch(mealType.toLowerCase()) {
    case 'breakfast':
      return <Coffee className="h-3 w-3 mr-1" />;
    case 'lunch':
      return <UtensilsCrossed className="h-3 w-3 mr-1" />;
    case 'dinner':
      return <UtensilsCrossed className="h-3 w-3 mr-1" />;
    default:
      return <Clock className="h-3 w-3 mr-1" />;
  }
};

// Function to get badge color based on day
export const getDayBadgeColor = (day: string) => {
  switch(day) {
    case 'Monday': return 'bg-muted-peach/20 text-muted-peach';
    case 'Tuesday': return 'bg-pistachio-green/20 text-pistachio-green';
    case 'Wednesday': return 'bg-primary-coral/20 text-primary-coral';
    case 'Thursday': return 'bg-slate-accent/20 text-slate-accent';
    case 'Friday': return 'bg-primary-coral/20 text-primary-coral';
    case 'Saturday': return 'bg-pistachio-green/20 text-pistachio-green';
    case 'Sunday': return 'bg-muted-peach/20 text-muted-peach';
    default: return 'bg-slate-accent/20 text-slate-accent';
  }
};

const MealBadges = ({ day, mealType, dayBadge, mealTypeBadge }: MealBadgesProps) => {
  // If custom badges are provided, use those
  if (dayBadge || mealTypeBadge) {
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {dayBadge}
        {mealTypeBadge}
      </div>
    );
  }
  
  // If no custom badges but we have day/mealType, generate them
  if (day || mealType) {
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {day && (
          <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getDayBadgeColor(day)}`}>
            {day}
          </div>
        )}
        
        {mealType && (
          <div className="inline-flex items-center rounded-full bg-warm-white px-2 py-1 text-xs font-medium text-charcoal-gray ml-2">
            {getMealTypeIcon(mealType)}
            {mealType}
          </div>
        )}
      </div>
    );
  }
  
  // If no badges data at all, return null
  return null;
};

export default MealBadges;
