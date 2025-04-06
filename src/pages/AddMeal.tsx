
import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';
import DateSelector from '@/components/meal/DateSelector';
import MealTypeSelector from '@/components/meal/MealTypeSelector';
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
  const [imageUrl, setImageUrl] = useState("");
  
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
    const existingMeals = localStorage.getItem('forkful_meals');
    const meals = existingMeals ? JSON.parse(existingMeals) : [];
    
    // Process ingredients - split by commas and newlines
    const processedIngredients = ingredients
      .split(/[\n,]+/)
      .map(item => item.trim())
      .filter(item => item !== '');
    
    // Create a new meal object
    const newMeal = {
      id: `meal-${Date.now()}`, // Generate a unique ID using timestamp
      title: title.trim(),
      submittedBy: 'You', // In a real app, this would be the user's name
      image: imageUrl || '',
      upvotes: 0,
      downvotes: 0,
      day: format(date || new Date(), 'EEEE').substring(0, 3) as any, // Convert to 'Mon', 'Tue', etc.
      mealType: mealType,
      ingredients: processedIngredients,
      dateAdded: new Date().toISOString()
    };
    
    // Add the new meal to the beginning of the array
    const updatedMeals = [newMeal, ...meals];
    
    // Save to localStorage
    localStorage.setItem('forkful_meals', JSON.stringify(updatedMeals));
    
    // Log for debugging
    console.log({ date, mealType, title, ingredients, imageUrl });
    
    // Show success toast and navigate back
    toast({
      title: "Success!",
      description: "Meal idea added to calendar",
    });
    navigate('/');
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
      {/* Header - reduced padding */}
      <div className="bg-primary text-white px-4 py-3 flex items-center">
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
        
        {/* Meal details */}
        <div>
          <label className="block text-sm font-medium mb-1">Meal name</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Chicken Alfredo"
            required
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
          <label className="block text-sm font-medium mb-1">Ingredients (separated by commas or new lines)</label>
          <Textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="List ingredients, separated by commas or new lines"
            className="min-h-[100px]"
          />
          <p className="text-xs text-slate-accent mt-1">Press Enter or use commas for multiple ingredients</p>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-full"
        >
          Add Idea
        </Button>
      </form>
    </div>
  );
};

export default AddMeal;
