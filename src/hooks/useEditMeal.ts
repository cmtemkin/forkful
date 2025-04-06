
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

interface FormValues {
  title: string;
  ingredients: string;
  sourceUrl?: string;
  image?: string;
  mealType: string;
  day: string;
}

export const useEditMeal = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [originalMeal, setOriginalMeal] = useState<any>(null);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>();
  
  useEffect(() => {
    // Load existing meal data
    const storedMeals = localStorage.getItem('forkful_meals');
    if (storedMeals && id) {
      const meals = JSON.parse(storedMeals);
      const meal = meals.find((m: any) => m.id === id);
      
      if (meal) {
        setOriginalMeal(meal);
        setValue('title', meal.title);
        setValue('mealType', meal.mealType);
        setValue('ingredients', Array.isArray(meal.ingredients) ? meal.ingredients.join('\n') : '');
        setValue('sourceUrl', meal.sourceUrl || '');
        setValue('image', meal.image || '');
        setValue('day', meal.day || 'Monday');
        
        // Convert day string to date if possible
        try {
          const today = new Date();
          const dayMap: {[key: string]: number} = {
            'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 0
          };
          if (meal.day && dayMap[meal.day] !== undefined) {
            const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
            let daysToAdd = dayMap[meal.day] - currentDay;
            if (daysToAdd <= 0) daysToAdd += 7; // If it's in the past, go to next week
            const mealDate = new Date(today);
            mealDate.setDate(today.getDate() + daysToAdd);
            setDate(mealDate);
          }
        } catch (error) {
          console.error("Error setting date from day", error);
        }
      } else {
        toast({
          title: "Meal not found",
          description: "We couldn't find the meal you're trying to edit.",
          variant: "destructive"
        });
        navigate('/');
      }
    }
  }, [id, setValue, navigate, toast]);
  
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    
    if (newDate) {
      // Convert date to day of week
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayOfWeek = days[newDate.getDay()];
      setValue('day', dayOfWeek);
    }
  };
  
  const handleImageUrlChange = (url: string) => {
    setValue('image', url);
  };
  
  const handleImageError = () => {
    setValue('image', '');
  };
  
  const onSubmit = async (data: FormValues) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Process ingredients - split by newlines and trim whitespace
      const ingredients = data.ingredients
        .split('\n')
        .map(item => item.trim())
        .filter(item => item !== '');
      
      // Update meal in localStorage
      const storedMeals = localStorage.getItem('forkful_meals');
      if (storedMeals && id) {
        const meals = JSON.parse(storedMeals);
        const updatedMeals = meals.map((meal: any) => {
          if (meal.id === id) {
            return {
              ...meal,
              title: data.title,
              mealType: data.mealType,
              ingredients,
              sourceUrl: data.sourceUrl,
              image: data.image,
              day: data.day,
              lastUpdated: new Date().toISOString()
            };
          }
          return meal;
        });
        
        localStorage.setItem('forkful_meals', JSON.stringify(updatedMeals));
      }
      
      toast({
        title: "Changes saved",
        description: "Your meal has been updated successfully."
      });
      
      // Navigate back to the meal detail
      navigate(`/meal/${id}`);
    } catch (error) {
      console.error("Error updating meal:", error);
      
      toast({
        title: "Error saving changes",
        description: "An error occurred while saving your changes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    originalMeal,
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    date,
    handleDateChange,
    handleImageUrlChange,
    handleImageError,
    onSubmit
  };
};
