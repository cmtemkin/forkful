
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MealTypeSelector from './MealTypeSelector';
import RecipeUrlInput from './RecipeUrlInput';
import RecipeImagePreview from './RecipeImagePreview';
import DateSelector from './DateSelector';
import { FormHookProps, ScrapedData } from './types/MealFormTypes';

const FormHookMealForm = ({
  register,
  errors,
  watch,
  setValue,
  date,
  onDateChange,
  onImageUrlChange,
  onImageError
}: FormHookProps) => {
  const image = watch('image');
  const mealType = watch('mealType');
  
  // Handle scraped data from recipe URL
  const handleScrapedData = (data: ScrapedData) => {
    if (data.title) setValue('title', data.title);
    if (data.ingredients) setValue('ingredients', data.ingredients);
    if (data.instructions) setValue('instructions', data.instructions.join('\n'));
    if (data.imageUrl) setValue('image', data.imageUrl);
    if (data.sourceUrl) setValue('sourceUrl', data.sourceUrl);
    if (data.sourceDomain) setValue('sourceDomain', data.sourceDomain);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <div className="mb-4">
          <RecipeImagePreview 
            imageUrl={image || ''} 
            title={watch('title') || 'Recipe'} 
            onError={onImageError}
          />
        </div>
        <RecipeUrlInput 
          onImageUrl={onImageUrlChange} 
          initialUrl={watch('sourceUrl') || ''}
          onScrapedData={handleScrapedData}
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
          onDateChange={onDateChange}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Ingredients (one per line)</label>
        <Textarea
          {...register("ingredients")}
          placeholder="Enter ingredients, one per line"
          className="min-h-[100px]"
        />
        <p className="text-xs text-slate-accent mt-1">Press Enter for a new ingredient</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Instructions (optional)</label>
        <Textarea
          {...register("instructions")}
          placeholder="Enter cooking instructions, one step per line"
          className="min-h-[150px]"
        />
        <p className="text-xs text-slate-accent mt-1">Press Enter for a new step</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Recipe URL (optional)</label>
        <Input
          {...register("sourceUrl")}
          placeholder="https://example.com/recipe"
        />
      </div>
    </div>
  );
};

export default FormHookMealForm;
