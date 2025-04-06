
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MealTypeSelector from './MealTypeSelector';
import RecipeUrlInput from './RecipeUrlInput';
import RecipeImagePreview from './RecipeImagePreview';
import DateSelector from './DateSelector';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';

interface FormValues {
  title: string;
  ingredients: string;
  sourceUrl?: string;
  image?: string;
  mealType: string;
  day: string;
}

interface EditMealFormProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  onImageUrlChange: (url: string) => void;
  onImageError: () => void;
}

const EditMealForm = ({
  register,
  errors,
  watch,
  setValue,
  date,
  onDateChange,
  onImageUrlChange,
  onImageError
}: EditMealFormProps) => {
  const image = watch('image');
  const mealType = watch('mealType');
  
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
        <label className="block text-sm font-medium mb-1">Recipe URL (optional)</label>
        <Input
          {...register("sourceUrl")}
          placeholder="https://example.com/recipe"
        />
      </div>
    </div>
  );
};

export default EditMealForm;
