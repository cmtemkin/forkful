import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, Lock, Unlock, ExternalLink, Trash2, ShoppingCart, Edit, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, parseISO } from 'date-fns';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { ImageIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const MealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [meal, setMeal] = useState<any>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [localUpvotes, setLocalUpvotes] = useState(0);
  const [localDownvotes, setLocalDownvotes] = useState(0);
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  useEffect(() => {
    // Get meal from localStorage - check forkful_meals first, then fall back to chowdown_meals
    const storedMeals = localStorage.getItem('forkful_meals') || localStorage.getItem('chowdown_meals');
    if (storedMeals) {
      const allMeals = JSON.parse(storedMeals);
      const foundMeal = allMeals.find((m: any) => m.id === id);
      
      if (foundMeal) {
        setMeal(foundMeal);
        setIsLocked(foundMeal.isLocked || false);
        setLocalUpvotes(foundMeal.upvotes);
        setLocalDownvotes(foundMeal.downvotes);
        
        // Calculate date from day of week
        if (foundMeal.day) {
          const today = new Date();
          const dayMap: {[key: string]: number} = {
            'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 0
          };
          const mealDay = dayMap[foundMeal.day];
          if (mealDay !== undefined) {
            let daysToAdd = mealDay - today.getDay();
            if (daysToAdd <= 0) daysToAdd += 7; // If it's in the past, go to next week
            const mealDate = new Date(today);
            mealDate.setDate(today.getDate() + daysToAdd);
            setDate(mealDate);
          }
        }
      }
    }
    setIsLoading(false);
  }, [id]);
  
  const toggleLock = () => {
    setIsLocked(!isLocked);
    
    // Update the meal in localStorage
    const storedMeals = localStorage.getItem('forkful_meals') || localStorage.getItem('chowdown_meals');
    if (storedMeals && meal) {
      const allMeals = JSON.parse(storedMeals);
      const updatedMeals = allMeals.map((m: any) => 
        m.id === id ? { ...m, isLocked: !isLocked } : m
      );
      localStorage.setItem('forkful_meals', JSON.stringify(updatedMeals));
    }
  };
  
  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate || !meal) return;
    
    setDate(newDate);
    
    // Update the day of week based on the selected date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const newDay = days[newDate.getDay()];
    
    // Update the meal locally
    const updatedMeal = { ...meal, day: newDay };
    setMeal(updatedMeal);
    
    // Update the meal in localStorage
    const storedMeals = localStorage.getItem('forkful_meals') || localStorage.getItem('chowdown_meals');
    if (storedMeals) {
      const allMeals = JSON.parse(storedMeals);
      const updatedMeals = allMeals.map((m: any) => 
        m.id === id ? { ...m, day: newDay } : m
      );
      localStorage.setItem('forkful_meals', JSON.stringify(updatedMeals));
      
      toast({
        title: "Date updated",
        description: `This meal is now scheduled for ${newDay}.`
      });
    }
  };
  
  const handleAddToGroceries = () => {
    if (!meal?.ingredients || meal.ingredients.length === 0) {
      toast({
        title: "No ingredients",
        description: "This meal doesn't have any ingredients to add to the grocery list.",
        variant: "destructive"
      });
      return;
    }
    
    // Get current grocery list from localStorage or initialize with empty array
    const existingList = localStorage.getItem('forkful_groceries') || localStorage.getItem('chowdown_groceries') || '[]';
    const groceryList = JSON.parse(existingList);
    
    // Process all ingredients, ensuring they are individual items
    const processedIngredients = meal.ingredients.flatMap((ingredient: string) => {
      // If the ingredient contains commas, split it
      if (ingredient.includes(',')) {
        return ingredient.split(',').map(i => i.trim()).filter(i => i !== '');
      }
      return ingredient.trim();
    });
    
    // Add each ingredient as a separate item if not already in the list
    const existingItems = new Set(groceryList.map((item: any) => item.name.toLowerCase()));
    
    const newItems = processedIngredients
      .filter((ingredient: string) => !existingItems.has(ingredient.toLowerCase()))
      .map((ingredient: string) => ({
        id: `grocery-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: ingredient,
        checked: false,
        recipe: meal.title
      }));
    
    if (newItems.length === 0) {
      toast({
        title: "Already in list",
        description: "All ingredients from this recipe are already in your grocery list.",
      });
      return;
    }
    
    // Add the new items to the list
    const updatedList = [...groceryList, ...newItems];
    
    // Save to localStorage
    localStorage.setItem('forkful_groceries', JSON.stringify(updatedList));
    
    toast({
      title: "Added to grocery list",
      description: `${newItems.length} ingredients added to your grocery list.`,
    });
  };
  
  const handleDeleteMeal = () => {
    // Remove the meal from localStorage
    const storedMeals = localStorage.getItem('forkful_meals') || localStorage.getItem('chowdown_meals');
    if (storedMeals) {
      const allMeals = JSON.parse(storedMeals);
      const updatedMeals = allMeals.filter((m: any) => m.id !== id);
      localStorage.setItem('forkful_meals', JSON.stringify(updatedMeals));
    }
    
    toast({
      title: "Meal deleted",
      description: "The meal has been successfully deleted.",
    });
    
    navigate('/calendar');
  };
  
  const handleEditMeal = () => {
    navigate(`/edit-meal/${id}`);
  };
  
  const generatePlaceholderColor = (title: string) => {
    let hash = 0;
    for (let i = 0; i < title?.length || 0; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 80%)`;
  };
  
  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If already upvoted, remove upvote
    if (userVote === 'up') {
      setLocalUpvotes(prev => prev - 1);
      setUserVote(null);
      
      // Update in localStorage
      updateVotesInStorage(localUpvotes - 1, localDownvotes);
      
      toast({
        title: "Upvote removed",
        description: `You removed your upvote from ${meal?.title}`,
      });
    } 
    // If previously downvoted, switch to upvote
    else if (userVote === 'down') {
      setLocalUpvotes(prev => prev + 1);
      setLocalDownvotes(prev => prev - 1);
      setUserVote('up');
      
      // Update in localStorage
      updateVotesInStorage(localUpvotes + 1, localDownvotes - 1);
      
      toast({
        title: "Changed to upvote",
        description: `You changed your vote to upvote for ${meal?.title}`,
      });
    } 
    // If no previous vote, add upvote
    else {
      setLocalUpvotes(prev => prev + 1);
      setUserVote('up');
      
      // Update in localStorage
      updateVotesInStorage(localUpvotes + 1, localDownvotes);
      
      toast({
        title: "Upvoted",
        description: `You upvoted ${meal?.title}`,
      });
    }
  };
  
  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If already downvoted, remove downvote
    if (userVote === 'down') {
      setLocalDownvotes(prev => prev - 1);
      setUserVote(null);
      
      // Update in localStorage
      updateVotesInStorage(localUpvotes, localDownvotes - 1);
      
      toast({
        title: "Downvote removed",
        description: `You removed your downvote from ${meal?.title}`,
      });
    } 
    // If previously upvoted, switch to downvote
    else if (userVote === 'up') {
      setLocalDownvotes(prev => prev + 1);
      setLocalUpvotes(prev => prev - 1);
      setUserVote('down');
      
      // Update in localStorage
      updateVotesInStorage(localUpvotes - 1, localDownvotes + 1);
      
      toast({
        title: "Changed to downvote",
        description: `You changed your vote to downvote for ${meal?.title}`,
      });
    } 
    // If no previous vote, add downvote
    else {
      setLocalDownvotes(prev => prev + 1);
      setUserVote('down');
      
      // Update in localStorage
      updateVotesInStorage(localUpvotes, localDownvotes + 1);
      
      toast({
        title: "Downvoted",
        description: `You downvoted ${meal?.title}`,
      });
    }
  };
  
  const updateVotesInStorage = (upvotes: number, downvotes: number) => {
    const storedMeals = localStorage.getItem('forkful_meals') || localStorage.getItem('chowdown_meals');
    if (storedMeals && meal) {
      const allMeals = JSON.parse(storedMeals);
      const updatedMeals = allMeals.map((m: any) => 
        m.id === id ? { ...m, upvotes, downvotes } : m
      );
      localStorage.setItem('forkful_meals', JSON.stringify(updatedMeals));
    }
  };
  
  // Format date as a string
  const getDisplayDate = () => {
    if (!date) return "";
    return format(date, 'MMM d');
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!meal) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Meal not found</h2>
        <p className="text-gray-500 mb-6">This meal may have been removed or does not exist</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }
  
  return (
    <div className="pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white z-30 flex items-center justify-between px-4 py-3 border-b">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex-1"></div>
        <button onClick={handleEditMeal} className="ml-4">
          <Edit className="h-6 w-6 text-chow-primary" />
        </button>
      </div>
      
      <div className="relative pt-12">
        <div className="bg-green-800 aspect-square">
          {meal.image && !imageError ? (
            <img 
              src={meal.image} 
              alt={meal.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div 
              className="w-full h-full flex flex-col items-center justify-center p-4"
              style={{ backgroundColor: generatePlaceholderColor(meal.title) }}
            >
              <ImageIcon className="h-16 w-16 text-white/70 mb-2" />
              <span className="text-lg font-medium text-white text-center">{meal.title}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">{meal.title}</h1>
        <div className="flex items-center text-gray-600 mb-2">
          <span>{meal.day} {meal.mealType}</span>
          <span className="mx-2">•</span>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center text-sm text-chow-primary">
                <span>{getDisplayDate()}</span>
                <Calendar className="h-4 w-4 ml-1" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="text-sm text-gray-500 mb-6">
          {meal.submittedBy ? `Added by ${meal.submittedBy}` : ""}
        </div>
        
        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
        <ul className="mb-8">
          {meal.ingredients && meal.ingredients.length > 0 ? (
            meal.ingredients.map((ingredient: string, i: number) => (
              <li key={i} className="flex items-start mb-1">
                <span className="mr-2">•</span>
                <span>{ingredient}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No ingredients listed</li>
          )}
        </ul>
        
        <div className="flex gap-4 mb-8">
          <Button 
            variant="outline" 
            className={`flex-1 upvote border-chow-upvote/20 ${userVote === 'up' ? 'bg-chow-upvote/30' : ''}`}
            disabled={isLocked}
            onClick={handleUpvote}
          >
            <ThumbsUp className="mr-2 h-5 w-5" />
            <span>{localUpvotes}</span>
          </Button>
          <Button 
            variant="outline" 
            className={`flex-1 downvote border-chow-downvote/20 ${userVote === 'down' ? 'bg-chow-downvote/30' : ''}`}
            disabled={isLocked}
            onClick={handleDownvote}
          >
            <ThumbsDown className="mr-2 h-5 w-5" />
            <span>{localDownvotes}</span>
          </Button>
        </div>
        
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="border-gray-300 hover:bg-gray-100"
            onClick={toggleLock}
          >
            {isLocked ? (
              <>
                <Unlock className="mr-2 h-5 w-5" />
                <span>Unlock This Meal</span>
              </>
            ) : (
              <>
                <Lock className="mr-2 h-5 w-5" />
                <span>Lock This Meal</span>
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            className="border-chow-secondary/40 hover:bg-chow-secondary/10 text-chow-secondary"
            onClick={handleAddToGroceries}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            <span>Add to Grocery List</span>
          </Button>
          
          {meal.sourceUrl && (
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
              onClick={() => window.open(meal.sourceUrl, '_blank')}
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              <span>View Original Recipe</span>
            </Button>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-chow-downvote/20 hover:bg-chow-downvote/10 text-chow-downvote"
              >
                <Trash2 className="mr-2 h-5 w-5" />
                <span>Delete This Meal</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the meal
                  from your calendar.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteMeal}
                  className="bg-chow-downvote text-white hover:bg-chow-downvote/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default MealDetail;
