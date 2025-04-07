
import { useToast } from '@/hooks/use-toast';
import { Meal, getMealsFromStorage, saveMealsToStorage } from '@/utils/mealUtils';

export function useMealVote(meal: Meal | null) {
  const { toast } = useToast();
  
  const handleVote = (isUpvote: boolean) => {
    if (!meal) return null;
    
    try {
      const meals = getMealsFromStorage();
      const updatedMeals = meals.map(m => {
        if (m.id === meal.id) {
          if (isUpvote) {
            return { ...m, upvotes: m.upvotes + 1 };
          } else {
            return { ...m, downvotes: m.downvotes + 1 };
          }
        }
        return m;
      });
      
      saveMealsToStorage(updatedMeals);
      
      const updatedMeal = isUpvote 
        ? { ...meal, upvotes: meal.upvotes + 1 }
        : { ...meal, downvotes: meal.downvotes + 1 };
      
      toast({
        title: isUpvote ? "Upvoted" : "Downvoted",
        description: `You've ${isUpvote ? 'upvoted' : 'downvoted'} this meal.`,
      });
      
      return updatedMeal;
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to register vote",
        variant: "destructive"
      });
      return null;
    }
  };
  
  return { handleVote };
}
