
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import MealCard from '../components/MealCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { Badge } from "@/components/ui/badge";

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

// Get the stored meals from localStorage or use the mock data
const getInitialMeals = () => {
  const storedMeals = localStorage.getItem('forkful_meals');
  return storedMeals ? JSON.parse(storedMeals) : mockMeals;
};

const VotingFeed = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('By Date');
  const [meals, setMeals] = useState(getInitialMeals);
  
  // Get the current day and mealtime for the header
  const currentDayMeal = 'Monday Dinner';
  
  useEffect(() => {
    // Update localStorage whenever meals change
    localStorage.setItem('forkful_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    // Migrate old data if it exists
    const oldStoredMeals = localStorage.getItem('chowdown_meals');
    if (oldStoredMeals && !localStorage.getItem('forkful_meals')) {
      localStorage.setItem('forkful_meals', oldStoredMeals);
      setMeals(JSON.parse(oldStoredMeals));
    }
  }, []);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    
    // Sort meals based on the selected filter
    const sortedMeals = [...meals];
    if (filter === 'By Votes') {
      sortedMeals.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    } else {
      // By Date - use the original order or sort by date if available
      sortedMeals.sort((a, b) => a.id.localeCompare(b.id));
    }
    
    setMeals(sortedMeals);
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Function to get badge color based on day
  const getDayBadgeColor = (day: string) => {
    switch(day) {
      case 'Monday': return 'bg-blue-100 text-blue-800';
      case 'Tuesday': return 'bg-purple-100 text-purple-800';
      case 'Wednesday': return 'bg-green-100 text-green-800';
      case 'Thursday': return 'bg-yellow-100 text-yellow-800';
      case 'Friday': return 'bg-red-100 text-red-800';
      case 'Saturday': return 'bg-indigo-100 text-indigo-800';
      case 'Sunday': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pb-20">
      {/* Header with logo */}
      <div className="bg-[#FF7A5A] text-white px-4 py-4 flex justify-center">
        <div className="w-32">
          <img 
            src="/lovable-uploads/ee2fee59-cbb5-4a35-ae3f-7e3c36de6388.png" 
            alt="Forkful" 
            className="w-full" 
          />
        </div>
      </div>
      
      {/* Filter tabs */}
      <div className="px-4 py-2 bg-white border-b">
        <button 
          className={`px-2 py-2 ${selectedFilter === 'By Date' ? 'tab-active' : 'text-gray-500'}`}
          onClick={() => handleFilterChange('By Date')}
        >
          By Date
        </button>
        <button 
          className={`px-2 py-2 ml-4 ${selectedFilter === 'By Votes' ? 'tab-active' : 'text-gray-500'}`}
          onClick={() => handleFilterChange('By Votes')}
        >
          By Votes
        </button>
      </div>
      
      {/* Meal cards */}
      <div className="px-4 py-4 space-y-4">
        {meals.length > 0 ? (
          meals.map(meal => (
            <div key={meal.id} className="relative">
              <div className="absolute -top-2 left-24 z-10">
                <div className={`rounded-full px-2 py-0.5 text-xs font-medium ${getDayBadgeColor(meal.day)}`}>
                  {meal.day}
                </div>
              </div>
              <MealCard
                id={meal.id}
                title={meal.title}
                submittedBy={meal.submittedBy || 'Anonymous'}
                image={meal.image}
                upvotes={meal.upvotes}
                downvotes={meal.downvotes}
                dayMealtime={`${meal.day} ${meal.mealType}`}
              />
            </div>
          ))
        ) : (
          <EmptyState
            title="No meal ideas yet"
            description="Add your first meal idea"
            actionLink="/add-meal"
            actionText="Add New Idea"
          />
        )}
      </div>
      
      {/* Add new idea button - centered at bottom, now using + icon */}
      <div className="fixed bottom-24 left-0 right-0 flex justify-center z-10">
        <Link 
          to="/add-meal"
          className="bg-[#FF7A5A] text-white h-12 w-12 rounded-full font-medium flex items-center justify-center shadow-md hover:bg-opacity-90 transition-all duration-200"
          aria-label="Add new idea"
        >
          <Plus size={24} />
        </Link>
      </div>
    </div>
  );
};

export default VotingFeed;
