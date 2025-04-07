
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Meal, getMealsFromStorage, saveMealsToStorage } from '@/utils/mealUtils';

export function useMealDelete(meal: Meal | null) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleDelete = () => {
    if (!meal) return;
    
    try {
      const meals = getMealsFromStorage();
      const updatedMeals = meals.filter(m => m.id !== meal.id);
      
      saveMealsToStorage(updatedMeals);
      
      toast({
        title: "Meal deleted",
        description: "The meal has been removed from your calendar.",
      });
      
      navigate('/calendar');
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete meal",
        variant: "destructive"
      });
    }
  };
  
  return {
    showDeleteDialog,
    setShowDeleteDialog,
    handleDelete
  };
}
