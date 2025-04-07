
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MealTypeSelector from './MealTypeSelector';
import RecipeUrlInput from './RecipeUrlInput';
import RecipeImagePreview from './RecipeImagePreview';
import DateSelector from './DateSelector';
import { StateProps, ScrapedData } from './types/MealFormTypes';

const StateMealForm = ({
  editTitle,
  setEditTitle,
  editMealType,
  setEditMealType,
  editDate,
  setEditDate,
  editIngredients,
  setEditIngredients,
  editInstructions = '',
  setEditInstructions,
  editImage,
  setEditImage
}: StateProps) => {
  const handleImageError = () => {
    setEditImage('');
  };
  
  const handleImageUrlChange = (url: string) => {
    setEditImage(url);
  };
  
  const handleScrapedData = (data: ScrapedData) => {
    if (data.title) setEditTitle(data.title);
    if (data.ingredients) setEditIngredients(data.ingredients);
    if (data.instructions && setEditInstructions) 
      setEditInstructions(data.instructions.join('\n'));
    if (data.imageUrl) setEditImage(data.imageUrl);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <div className="mb-4">
          <RecipeImagePreview 
            imageUrl={editImage || ''} 
            title={editTitle || 'Recipe'} 
            onError={handleImageError}
          />
        </div>
        <RecipeUrlInput 
          onImageUrl={handleImageUrlChange} 
          initialUrl={editImage || ''}
          onScrapedData={handleScrapedData}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Enter meal title"
          className=""
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MealTypeSelector
          value={editMealType}
          onChange={(value) => setEditMealType(value as 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks')}
        />
        
        <DateSelector 
          date={editDate}
          onDateChange={setEditDate}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Ingredients (one per line)</label>
        <Textarea
          value={editIngredients}
          onChange={(e) => setEditIngredients(e.target.value)}
          placeholder="Enter ingredients, one per line"
          className="min-h-[100px]"
        />
        <p className="text-xs text-slate-accent mt-1">Press Enter for a new ingredient</p>
      </div>
      
      {setEditInstructions && (
        <div>
          <label className="block text-sm font-medium mb-1">Instructions (optional)</label>
          <Textarea
            value={editInstructions}
            onChange={(e) => setEditInstructions(e.target.value)}
            placeholder="Enter cooking instructions, one step per line"
            className="min-h-[150px]"
          />
          <p className="text-xs text-slate-accent mt-1">Press Enter for a new step</p>
        </div>
      )}
    </div>
  );
};

export default StateMealForm;
