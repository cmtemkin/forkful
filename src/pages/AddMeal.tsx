
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "@/hooks/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';
import DateSelector from '@/components/meal/DateSelector';
import MealTypeSelector from '@/components/meal/MealTypeSelector';
import RecipeUrlInput from '@/components/meal/RecipeUrlInput';
import RecipeImagePreview from '@/components/meal/RecipeImagePreview';

const AddMeal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultDay = queryParams.get('day') || '';
  const defaultMealType = queryParams.get('mealType') || '';
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [mealType, setMealType] = useState(defaultMealType || "Dinner");
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [recipeUrl, setRecipeUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log({ date, mealType, title, ingredients, recipeUrl, imageUrl });
    
    // Show success toast and navigate back
    toast({
      title: "Success!",
      description: "Meal idea added to calendar",
    });
    navigate('/');
  };
  
  const handleScrapedData = (data: { title?: string; ingredients?: string; imageUrl?: string }) => {
    // Only update fields if they're not already filled in
    if (data.title && !title) setTitle(data.title);
    if (data.ingredients && !ingredients) setIngredients(data.ingredients);
    if (data.imageUrl) setImageUrl(data.imageUrl);
  };
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-chow-primary text-white px-4 py-6 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Add New Idea</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Date selection */}
        <DateSelector 
          date={date} 
          onDateChange={setDate} 
        />
        
        {/* Meal type selection */}
        <MealTypeSelector 
          value={mealType} 
          onChange={setMealType} 
        />
        
        {/* Recipe URL for scraping */}
        <RecipeUrlInput 
          disabled={isScraping}
          onScrapedData={handleScrapedData}
        />
        
        {/* Meal details */}
        <div>
          <label className="block text-sm font-medium mb-1">Meal name</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Chicken Alfredo"
            required
            disabled={isScraping}
          />
        </div>
        
        {/* Image preview if available */}
        <RecipeImagePreview 
          imageUrl={imageUrl}
          title={title}
          onError={() => setImageUrl("")}
        />
        
        <div>
          <label className="block text-sm font-medium mb-1">Ingredients</label>
          <Textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="List ingredients, one per line"
            className="min-h-[100px]"
            disabled={isScraping}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-chow-primary hover:bg-chow-primary/90 text-white py-6 rounded-full"
          disabled={isScraping}
        >
          {isScraping ? <LoadingSpinner /> : "Add to Calendar"}
        </Button>
      </form>
    </div>
  );
};

export default AddMeal;
