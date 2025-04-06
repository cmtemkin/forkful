
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, Coffee, UtensilsCrossed } from 'lucide-react';
import MealCard from '../components/MealCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { getHouseholdMeals } from '@/services/mealService';
import { useToast } from '@/hooks/use-toast';

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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('By Date');
  const [meals, setMeals] = useState<any[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setIsLoading(true);
        const fetchedMeals = await getHouseholdMeals();
        setMeals(fetchedMeals);
      } catch (error) {
        console.error('Error fetching meals:', error);
        toast({
          title: "Error loading meals",
          description: error instanceof Error ? error.message : "Could not load your meal ideas. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMeals();
  }, [toast]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    
    // Sort meals based on the selected filter
    const sortedMeals = [...meals];
    if (filter === 'By Votes') {
      sortedMeals.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    } else {
      // By Date - use the original order or sort by date if available
      sortedMeals.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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
      
      {/* Meal cards container */}
      <div className="px-4 py-4 space-y-4">
        {meals.length > 0 ? (
          meals.map(meal => (
            <div key={meal.id} className="relative">
              <MealCard
                id={meal.id}
                title={meal.title}
                submittedBy="You" // Since all meals are user's own
                image={meal.image_path}
                upvotes={meal.upvotes}
                downvotes={meal.downvotes}
                dayMealtime={`${meal.day} ${meal.meal_type}`}
                dayBadge={
                  <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getDayBadgeColor(meal.day)}`}>
                    {meal.day}
                  </div>
                }
                mealTypeBadge={
                  <div className="inline-flex items-center rounded-full bg-warm-white px-2 py-1 text-xs font-medium text-charcoal-gray ml-2">
                    {getMealTypeIcon(meal.meal_type)}
                    {meal.meal_type}
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
