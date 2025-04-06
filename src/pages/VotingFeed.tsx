import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, Coffee, UtensilsCrossed } from 'lucide-react';
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

// Get the stored meals from localStorage or use the mock data
const getInitialMeals = () => {
  const storedMeals = localStorage.getItem('forkful_meals');
  return storedMeals ? JSON.parse(storedMeals) : mockMeals;
};

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

const VotingFeed = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('By Date');
  const [meals, setMeals] = useState(getInitialMeals);
  
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

  return (
    <div className="pb-20 relative">
      {/* Filter tabs */}
      <div className="px-4 py-2 bg-white border-b border-slate-accent/10">
        <button 
          className={`px-2 py-2 ${selectedFilter === 'By Date' ? 'tab-active' : 'text-slate-accent'}`}
          onClick={() => handleFilterChange('By Date')}
        >
          By Date
        </button>
        <button 
          className={`px-2 py-2 ml-4 ${selectedFilter === 'By Votes' ? 'tab-active' : 'text-slate-accent'}`}
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
              <MealCard
                id={meal.id}
                title={meal.title}
                submittedBy={meal.submittedBy || 'Anonymous'}
                image={meal.image}
                upvotes={meal.upvotes}
                downvotes={meal.downvotes}
                dayMealtime={`${meal.day} ${meal.mealType}`}
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
      
      {/* Floating add button */}
      <div className="fixed bottom-24 right-4 z-50">
        <Link 
          to="/add-meal"
          className="bg-primary-coral text-white h-14 w-14 rounded-full font-medium flex items-center justify-center shadow-md hover:bg-opacity-90 transition-all duration-200"
          aria-label="Add new idea"
        >
          <Plus size={24} />
        </Link>
      </div>
    </div>
  );
};

export default VotingFeed;
