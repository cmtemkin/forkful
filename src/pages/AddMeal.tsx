
import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';
import DateSelector from '@/components/meal/DateSelector';
import MealTypeSelector from '@/components/meal/MealTypeSelector';
import RecipeUrlInput from '@/components/meal/RecipeUrlInput';
import RecipeImagePreview from '@/components/meal/RecipeImagePreview';
import { format } from 'date-fns';

const AddMeal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a meal name",
        variant: "destructive"
      });
      return;
    }
    
    // Get current meals from localStorage or initialize with empty array
    const existingMeals = localStorage.getItem('chowdown_meals');
    const meals = existingMeals ? JSON.parse(existingMeals) : [];
    
    // Create a new meal object
    const newMeal = {
      id: `meal-${Date.now()}`, // Generate a unique ID using timestamp
      title: title.trim(),
      submittedBy: 'You', // In a real app, this would be the user's name
      image: imageUrl || `https://source.unsplash.com/photo-${Math.floor(Math.random() * 100000)}`,
      upvotes: 0,
      downvotes: 0,
      day: format(date || new Date(), 'EEEE').substring(0, 3) as any, // Convert to 'Mon', 'Tue', etc.
      mealType: mealType,
      ingredients: ingredients.split('\n').filter(item => item.trim()),
      dateAdded: new Date().toISOString()
    };
    
    // Add the new meal to the beginning of the array
    const updatedMeals = [newMeal, ...meals];
    
    // Save to localStorage
    localStorage.setItem('chowdown_meals', JSON.stringify(updatedMeals));
    
    // Log for debugging
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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload the file to a server
      // For now, we'll just create a local URL
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
    }
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
        <div onClick={handleImageClick} className="cursor-pointer">
          <label className="block text-sm font-medium mb-1">Recipe Image (click to change)</label>
          <div className="w-full max-h-48 rounded-lg overflow-hidden">
            <RecipeImagePreview 
              imageUrl={imageUrl}
              title={title}
              onError={() => setImageUrl("")}
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        
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
          {isScraping ? <LoadingSpinner /> : "Add Idea"}
        </Button>
      </form>
    </div>
  );
};

export default AddMeal;
