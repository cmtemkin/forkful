
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Meal, getMealsFromStorage, saveMealsToStorage } from '@/utils/mealUtils';

export function useMealToggle(meal: Meal | null) {
  const { toast } = useToast();
  
  const togglePick = () => {
    if (!meal) return;
    
    try {
      const meals = getMealsFromStorage();
      const updatedMeals = meals.map(m => 
        m.id === meal.id ? { 
          ...m, 
          isPicked: !m.isPicked,
          pickedByUserId: !m.isPicked ? 'current-user' : undefined,
          pickedAt: !m.isPicked ? new Date().toISOString() : undefined 
        } : m
      );
      
      saveMealsToStorage(updatedMeals);
      
      const updatedMeal = { 
        ...meal, 
        isPicked: !meal.isPicked,
        pickedByUserId: !meal.isPicked ? 'current-user' : undefined,
        pickedAt: !meal.isPicked ? new Date().toISOString() : undefined 
      };
      
      if (!meal.isPicked) {
        // Meal is being picked - logging is handled by PickMealButton
        console.log('Meal picked!');
      } else {
        // Meal is being unpicked
        toast({
          title: "Meal unpicked",
          description: "This meal has been removed from your calendar",
        });
      }
      
      return updatedMeal;
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update meal picked status",
        variant: "destructive"
      });
      return null;
    }
  };
  
  return { togglePick };
}
