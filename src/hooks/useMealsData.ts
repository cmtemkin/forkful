
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Meal } from '@/utils/mealUtils';

// Mock data structure with the isPicked field
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
    return meals.map((meal: any) => ({
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

// Notify other components about the meal update
export const notifyMealUpdate = () => {
  window.dispatchEvent(new Event('forkful-meals-updated'));
};

export function useMealsData() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('By Date');
  const [meals, setMeals] = useState<Meal[]>(getInitialMeals);
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
        const migratedMeals = parsedMeals.map((meal: any) => ({
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
    
    // Notify other components about the meal update
    notifyMealUpdate();
  };

  return {
    meals,
    isLoading,
    selectedFilter,
    handleFilterChange,
    handleTogglePick
  };
}
