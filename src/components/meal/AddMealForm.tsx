
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DateSelector from '@/components/meal/DateSelector';
import MealTypeSelector from '@/components/meal/MealTypeSelector';
import RecipeImagePreview from '@/components/meal/RecipeImagePreview';
import RecipeUrlInput from '@/components/meal/RecipeUrlInput';

interface AddMealFormProps {
  title: string;
  setTitle: (title: string) => void;
  mealType: string;
  setMealType: (mealType: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  ingredients: string;
  setIngredients: (ingredients: string) => void;
  instructions: string;
  setInstructions: (instructions: string) => void;
  imageUrl: string;
  setImageUrl: (imageUrl: string) => void;
  recipeUrl: string;
  setRecipeUrl: (recipeUrl: string) => void;
  mode: 'date' | 'event';
  setMode: (mode: 'date' | 'event') => void;
  selectedEvent: string;
  setSelectedEvent: (eventId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  events: Array<{ id: string; name: string; date: Date }>;
}

const AddMealForm = ({
  title,
  setTitle,
  mealType,
  setMealType,
  date,
  setDate,
  ingredients,
  setIngredients,
  instructions,
  setInstructions,
  imageUrl,
  setImageUrl,
  recipeUrl,
  setRecipeUrl,
  mode,
  setMode,
  selectedEvent,
  setSelectedEvent,
  onSubmit,
  events
}: AddMealFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Handle scraped recipe data
  const handleScrapedData = (data: { 
    title?: string; 
    ingredients?: string; 
    instructions?: string[];
    imageUrl?: string;
    sourceUrl?: string;
  }) => {
    if (data.title) setTitle(data.title);
    if (data.ingredients) setIngredients(data.ingredients);
    if (data.instructions) setInstructions(data.instructions.join('\n'));
    if (data.imageUrl) setImageUrl(data.imageUrl);
    if (data.sourceUrl) setRecipeUrl(data.sourceUrl);
  };

  return (
    <form onSubmit={onSubmit} className="px-4 py-6 space-y-6">
      {/* Recipe URL input */}
      <div>
        <label className="block text-sm font-medium mb-1">Have a recipe link?</label>
        <RecipeUrlInput 
          onScrapedData={handleScrapedData}
          onRecipeUrl={setRecipeUrl}
          onImageUrl={setImageUrl}
        />
      </div>
      
      {/* Toggle between Date and Event */}
      <MealAssignmentToggle 
        mode={mode} 
        setMode={setMode} 
        date={date} 
        setDate={setDate}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        events={events}
      />
      
      {/* Meal type selection */}
      <MealTypeSelector 
        value={mealType} 
        onChange={(value) => setMealType(value)} 
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
      
      {/* Image preview */}
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
      
      <div>
        <label className="block text-sm font-medium mb-1">Instructions (optional)</label>
        <Textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="List cooking steps, one per line"
          className="min-h-[100px]"
        />
        <p className="text-xs text-slate-accent mt-1">Press Enter for each new step</p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-full"
      >
        Add Idea
      </Button>
    </form>
  );
};

export default AddMealForm;
