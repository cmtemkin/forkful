
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, Coffee, UtensilsCrossed } from 'lucide-react';
import MealCard from '../components/MealCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

// Sample data structure with the isPicked field
const mockMeals = [
  {
    id: '1',
    title: 'Chicken Alfredo',
    submittedBy: 'Sarah',
    image: 'https://source.unsplash.com/photo-1645112411341-6c4fd023882a',
    upvotes: 5,
    downvotes: 2,
    day: 'Monday',
    mealType: 'Dinner',
    ingredients: ['Chicken', 'Fettuccine', 'Heavy Cream', 'Parmesan Cheese'],
    isPicked: false
  },
  {
    id: '2',
    title: 'BBQ Meatloaf',
    submittedBy: 'David',
    image: 'https://source.unsplash.com/photo-1544025162-d76694265947',
    upvotes: 3,
    downvotes: 1,
    day: 'Monday',
    mealType: 'Dinner',
    ingredients: ['Ground Beef', 'BBQ Sauce', 'Breadcrumbs', 'Onion'],
    isPicked: false
  },
  {
    id: '3',
    title: 'Vegetable Stir-Fry',
    submittedBy: 'Emily',
    image: 'https://source.unsplash.com/photo-1563379926898-05f4575a45d8',
    upvotes: 2,
    downvotes: 4,
    day: 'Monday',
    mealType: 'Dinner',
    ingredients: ['Broccoli', 'Carrots', 'Bell Peppers', 'Soy Sauce', 'Rice'],
    isPicked: false
  }
];

// Get the stored meals from localStorage or use the mock data
const getInitialMeals = () => {
  try {
    const storedMeals = localStorage.getItem('forkful_meals');
    const meals = storedMeals ? JSON.parse(storedMeals) : mockMeals;
    
    // Ensure all meals have the required properties
    return meals.map(meal => ({
      id: meal.id || `meal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: meal.title || 'Untitled Meal',
      submittedBy: meal.submittedBy || 'Anonymous',
      image: meal.image || '',
      upvotes: typeof meal.upvotes === 'number' ? meal.upvotes : 0,
      downvotes: typeof meal.downvotes === 'number' ? meal.downvotes : 0,
      day: meal.day || 'Monday',
      mealType: meal.mealType || 'Dinner',
      ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
      isPicked: !!meal.isPicked
    }));
  } catch (error) {
    console.error('Error parsing meals from localStorage:', error);
    return mockMeals;
  }
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
  const { toast } = useToast();
  
  useEffect(() => {
    // Update localStorage whenever meals change
    localStorage.setItem('forkful_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    // Migrate old data if it exists
    const oldStoredMeals = localStorage.getItem('chowdown_meals');
    if (oldStoredMeals && !localStorage.getItem('forkful_meals')) {
      try {
        const parsedMeals = JSON.parse(oldStoredMeals);
        // Ensure all required properties are present
        const migratedMeals = parsedMeals.map(meal => ({
          ...meal,
          ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
          isPicked: !!meal.isLocked // Convert old isLocked to new isPicked
        }));
        localStorage.setItem('forkful_meals', JSON.stringify(migratedMeals));
        setMeals(migratedMeals);
      } catch (error) {
        console.error('Error migrating old meals data:', error);
      }
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
  
  const handleTogglePick = (mealId: string) => {
    const updatedMeals = meals.map(meal => {
      if (meal.id === mealId) {
        const newPickedState = !meal.isPicked;
        
        if (newPickedState) {
          // Get random success message
          const successMessages = [
            "Let's eat!",
            "Winner, winner, dinner's picked!",
            "Locked and loaded 🍴",
            "Chef's choice 🔥",
            "The table is set.",
            "This one's a go!",
            "Yesss! Let's make it.",
            "Everyone's on board.",
            "Can't wait for this one 🤤",
            "Menu secured!",
            "This meal's the vibe.",
            "Serving up greatness.",
            "Stamped & scheduled!"
          ];
          
          const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
          
          toast({
            title: "Meal picked!",
            description: randomMessage,
            duration: 2000,
          });
        } else {
          toast({
            title: "Meal unpicked",
            description: "This meal has been removed from your calendar",
          });
        }
        
        return {
          ...meal,
          isPicked: newPickedState,
          pickedByUserId: newPickedState ? 'current-user' : undefined, // Would use actual user ID in a real app
          pickedAt: newPickedState ? new Date().toISOString() : undefined
        };
      }
      return meal;
    });
    
    setMeals(updatedMeals);
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
      
      {/* Meal cards container */}
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
                isPicked={meal.isPicked}
                onTogglePick={() => handleTogglePick(meal.id)}
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
    </div>
  );
};

export default VotingFeed;
