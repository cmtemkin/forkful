
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Save, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import MealTypeSelector from '../components/meal/MealTypeSelector';
import RecipeUrlInput from '../components/meal/RecipeUrlInput';
import RecipeImagePreview from '../components/meal/RecipeImagePreview';
import DateSelector from '../components/meal/DateSelector';

interface FormValues {
  title: string;
  ingredients: string;
  sourceUrl?: string;
  image?: string;
  mealType: string;
  day: string;
}

const EditMeal = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [originalMeal, setOriginalMeal] = useState<any>(null);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>();
  
  const image = watch('image');
  const mealType = watch('mealType');
  
  useEffect(() => {
    // Load existing meal data
    const storedMeals = localStorage.getItem('chowdown_meals');
    if (storedMeals && id) {
      const meals = JSON.parse(storedMeals);
      const meal = meals.find((m: any) => m.id === id);
      
      if (meal) {
        setOriginalMeal(meal);
        setValue('title', meal.title);
        setValue('mealType', meal.mealType);
        setValue('ingredients', Array.isArray(meal.ingredients) ? meal.ingredients.join(', ') : '');
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
      // Process ingredients - split by commas and trim whitespace
      const ingredients = data.ingredients
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');
      
      // Update meal in localStorage
      const storedMeals = localStorage.getItem('chowdown_meals');
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
        
        localStorage.setItem('chowdown_meals', JSON.stringify(updatedMeals));
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
  
  if (!originalMeal) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-8 h-8 border-4 border-t-chow-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white z-30 flex items-center justify-between px-4 py-3 border-b">
        <button onClick={() => navigate(`/meal/${id}`)} className="flex items-center">
          <X className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">Edit Meal</h1>
        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="text-chow-primary"
        >
          <Save className="h-6 w-6" />
        </button>
      </div>
      
      <div className="pt-16 px-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <div className="mb-4">
              <RecipeImagePreview 
                imageUrl={image || ''} 
                title={watch('title') || 'Recipe'} 
                onError={handleImageError}
              />
            </div>
            <RecipeUrlInput 
              onImageUrl={handleImageUrlChange} 
              initialUrl={image || ''}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              {...register("title", { required: "Title is required" })}
              placeholder="Enter meal title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MealTypeSelector
              value={mealType || 'Dinner'}
              onChange={(value) => setValue('mealType', value)}
            />
            
            <DateSelector 
              date={date}
              onDateChange={handleDateChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Ingredients (comma separated)</label>
            <Textarea
              {...register("ingredients")}
              placeholder="Enter ingredients separated by commas"
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Recipe URL (optional)</label>
            <Input
              {...register("sourceUrl")}
              placeholder="https://example.com/recipe"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMeal;
