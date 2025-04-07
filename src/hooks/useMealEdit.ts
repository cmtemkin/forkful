
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Meal, getMealsFromStorage, saveMealsToStorage } from '@/utils/mealUtils';

export function useMealEdit(meal: Meal | null) {
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(meal?.title || '');
  const [editMealType, setEditMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>(
    meal?.mealType || 'Breakfast'
  );
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [editIngredients, setEditIngredients] = useState(meal?.ingredients.join('\n') || '');
  const [editImage, setEditImage] = useState(meal?.image || '');
  
  const handleSaveEdits = () => {
    if (!meal) return null;
    
    try {
      const meals = getMealsFromStorage();
      
      const processedIngredients = editIngredients
        .split(/[\n,]+/)
        .map(item => item.trim())
        .filter(item => item !== '');
      
      const updatedMeal = {
        ...meal,
        title: editTitle,
        mealType: editMealType,
        day: editDate ? format(editDate, 'EEE').substring(0, 3) as any : meal.day,
        ingredients: processedIngredients,
        image: editImage
      };
      
      const updatedMeals = meals.map(m => 
        m.id === meal.id ? updatedMeal : m
      );
      
      saveMealsToStorage(updatedMeals);
      
      setIsEditing(false);
      
      toast({
        title: "Changes saved",
        description: "Your changes to this meal have been saved.",
      });
      
      return updatedMeal;
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      });
      return null;
    }
  };
  
  return {
    isEditing,
    setIsEditing,
    editTitle,
    setEditTitle,
    editMealType,
    setEditMealType,
    editDate,
    setEditDate,
    editIngredients,
    setEditIngredients,
    editImage,
    setEditImage,
    handleSaveEdits
  };
}
