
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import MealCard from '../components/MealCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

// Sample data - in a real app, this would come from an API
const mockMeals = [
  {
    id: '1',
    title: 'Chicken Alfredo',
    submittedBy: 'Sarah',
    image: 'https://source.unsplash.com/photo-1645112411341-6c4fd023882a',
    upvotes: 5,
    downvotes: 2,
    day: 'Monday',
    mealType: 'Dinner'
  },
  {
    id: '2',
    title: 'BBQ Meatloaf',
    submittedBy: 'David',
    image: 'https://source.unsplash.com/photo-1544025162-d76694265947',
    upvotes: 3,
    downvotes: 1,
    day: 'Monday',
    mealType: 'Dinner'
  },
  {
    id: '3',
    title: 'Vegetable Stir-Fry',
    submittedBy: 'Emily',
    image: 'https://source.unsplash.com/photo-1563379926898-05f4575a45d8',
    upvotes: 2,
    downvotes: 4,
    day: 'Monday',
    mealType: 'Dinner'
  }
];

const VotingFeed = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('By Date');
  const [meals, setMeals] = useState(mockMeals);
  
  // Get the current day and mealtime for the header
  const currentDayMeal = 'Monday Dinner';
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-chow-primary text-white px-4 py-6">
        <h1 className="text-2xl font-bold">{currentDayMeal}</h1>
      </div>
      
      {/* Filter tabs */}
      <div className="px-4 py-2 bg-white border-b">
        <button className="px-2 py-2 tab-active">
          {selectedFilter}
        </button>
        <button className="px-2 py-2 ml-4 text-gray-500">
          By Votes
        </button>
      </div>
      
      {/* Meal cards */}
      <div className="px-4 py-4">
        {meals.length > 0 ? (
          meals.map(meal => (
            <MealCard
              key={meal.id}
              id={meal.id}
              title={meal.title}
              submittedBy={meal.submittedBy}
              image={meal.image}
              upvotes={meal.upvotes}
              downvotes={meal.downvotes}
            />
          ))
        ) : (
          <EmptyState
            title="No meal ideas yet"
            description="Add your first meal idea for Monday Dinner"
            actionLink="/add-meal"
            actionText="Add New Idea"
          />
        )}
      </div>
      
      {/* Add new idea button - centered at bottom */}
      <div className="fixed bottom-24 left-0 right-0 flex justify-center z-10">
        <Link 
          to="/add-meal"
          className="bg-chow-primary text-white py-3 px-6 rounded-full font-medium flex items-center justify-center shadow-md"
        >
          New Idea
        </Link>
      </div>
    </div>
  );
};

export default VotingFeed;
