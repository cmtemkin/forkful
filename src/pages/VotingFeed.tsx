
import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import MealFilterTabs from '../components/meal/MealFilterTabs';
import MealList from '../components/meal/MealList';
import { useMealsData } from '@/hooks/useMealsData';

const VotingFeed = () => {
  const { 
    meals, 
    isLoading, 
    selectedFilter, 
    handleFilterChange, 
    handleTogglePick 
  } = useMealsData();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pb-20 relative">
      <MealFilterTabs 
        selectedFilter={selectedFilter} 
        onFilterChange={handleFilterChange} 
      />
      
      <MealList 
        meals={meals} 
        onTogglePick={handleTogglePick} 
      />
    </div>
  );
};

export default VotingFeed;
