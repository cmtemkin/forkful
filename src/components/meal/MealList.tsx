
import React from 'react';
import MealCard from '../MealCard';
import EmptyState from '../EmptyState';
import { Meal } from '@/utils/mealUtils';
import MealBadges, { getDayBadgeColor, getMealTypeIcon } from './MealBadges';

interface MealListProps {
  meals: Meal[];
  onTogglePick: (mealId: string) => void;
}

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
