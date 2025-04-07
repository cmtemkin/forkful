
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import MealTypeSelector from '@/components/meal/MealTypeSelector';
import RecipeUrlInput from '@/components/meal/RecipeUrlInput';
import RecipeImagePreview from '@/components/meal/RecipeImagePreview';
import DateSelector from '@/components/meal/DateSelector';
import MealAssignmentToggle from '@/components/meal/MealAssignmentToggle';

interface AddMealFormProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  mealType: string;
  setMealType: React.Dispatch<React.SetStateAction<string>>;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  ingredients: string;
  setIngredients: React.Dispatch<React.SetStateAction<string>>;
  instructions: string;
  setInstructions: React.Dispatch<React.SetStateAction<string>>;
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  recipeUrl: string;
  setRecipeUrl: React.Dispatch<React.SetStateAction<string>>;
  mode: 'date' | 'event';
  setMode: React.Dispatch<React.SetStateAction<'date' | 'event'>>;
  selectedEvent: string;
  setSelectedEvent: React.Dispatch<React.SetStateAction<string>>;
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
  
  const handleImageError = () => {
    setImageUrl('');
  };
  
  const handleRecipeUrl = (url: string) => {
    setRecipeUrl(url);
  };
  
  const handleScrapedData = (data: any) => {
    if (data.title) setTitle(data.title);
    if (data.ingredients) setIngredients(data.ingredients);
    if (data.instructions) setInstructions(data.instructions.join('\n'));
    if (data.imageUrl) setImageUrl(data.imageUrl);
  };
  
  return (
    <form onSubmit={onSubmit} className="space-y-6 p-4">
      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <div className="mb-4">
          <RecipeImagePreview 
            imageUrl={imageUrl} 
            title={title} 
            onError={handleImageError}
          />
        </div>
        <RecipeUrlInput 
          onImageUrl={setImageUrl} 
          initialUrl={recipeUrl}
          onScrapedData={handleScrapedData}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter meal title"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MealTypeSelector
          value={mealType}
          onChange={(value) => setMealType(value)}
        />
      </div>
      
      <MealAssignmentToggle
        mode={mode}
        setMode={setMode}
        date={date}
        setDate={setDate}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        events={events}
      />
      
      <div>
        <label className="block text-sm font-medium mb-1">Ingredients (one per line)</label>
        <Textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter ingredients, one per line"
          className="min-h-[100px]"
        />
        <p className="text-xs text-gray-500 mt-1">Press Enter for a new ingredient</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Instructions (optional)</label>
        <Textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Enter cooking instructions, one step per line"
          className="min-h-[150px]"
        />
        <p className="text-xs text-gray-500 mt-1">Press Enter for a new step</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Recipe URL (optional)</label>
        <Input
          value={recipeUrl}
          onChange={(e) => setRecipeUrl(e.target.value)}
          placeholder="https://example.com/recipe"
        />
      </div>
      
      <Button type="submit" className="w-full py-6 text-lg rounded-xl">
        Add Meal Idea
      </Button>
    </form>
  );
};

export default AddMealForm;
