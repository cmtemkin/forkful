
import React from 'react';
import MealCard from '../MealCard';
import EmptyState from '../EmptyState';
import { Meal } from '@/utils/mealUtils';
import { Clock, Coffee, UtensilsCrossed } from 'lucide-react';

interface MealListProps {
  meals: Meal[];
  onTogglePick: (mealId: string) => void;
}

// Function to get meal type icon
const getMealTypeIcon = (mealType: string) => {
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
const getDayBadgeColor = (day: string) => {
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

const MealList = ({ meals, onTogglePick }: MealListProps) => {
  if (meals.length === 0) {
    return (
      <EmptyState
        title="No meal ideas yet"
        description="Add your first meal idea"
        actionLink="/add-meal"
        actionText="Add New Idea"
      />
    );
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {meals.map(meal => (
        <div key={meal.id} className="relative">
          <MealCard
            id={meal.id}
            title={meal.title}
            submittedBy={meal.submittedBy || 'Anonymous'}
            image={meal.image}
            upvotes={meal.upvotes}
            downvotes={meal.downvotes}
            isPicked={meal.isPicked}
            onTogglePick={() => onTogglePick(meal.id)}
            dayBadge={
              <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getDayBadgeColor(meal.day)}`}>
                {meal.day}
              </div>
            }
            mealTypeBadge={
              <div className="inline-flex items-center rounded-full bg-warm-white px-2 py-1 text-xs font-medium text-charcoal-gray ml-2">
                {getMealTypeIcon(meal.mealType)}
                {meal.mealType}
              </div>
            }
          />
        </div>
      ))}
    </div>
  );
};

export default MealList;
