
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MealTypeSelector from './MealTypeSelector';
import RecipeUrlInput from './RecipeUrlInput';
import RecipeImagePreview from './RecipeImagePreview';
import DateSelector from './DateSelector';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';

// Form values interface for form-hook based usage
interface FormValues {
  title: string;
  ingredients: string;
  instructions?: string;
  sourceUrl?: string;
  sourceDomain?: string;
  image?: string;
  mealType: string;
  day: string;
}

// Props for the form-hook based implementation
interface EditMealFormPropsWithFormHook {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  onImageUrlChange: (url: string) => void;
  onImageError: () => void;
}

// Props for direct state management implementation
interface EditMealFormPropsWithState {
  editTitle: string;
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;
  editMealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  setEditMealType: React.Dispatch<React.SetStateAction<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>>;
  editDate: Date | undefined;
  setEditDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  editIngredients: string;
  setEditIngredients: React.Dispatch<React.SetStateAction<string>>;
  editInstructions?: string;
  setEditInstructions?: React.Dispatch<React.SetStateAction<string>>;
  editImage: string;
  setEditImage: React.Dispatch<React.SetStateAction<string>>;
}

// Union type to allow either prop style
export type EditMealFormProps = EditMealFormPropsWithFormHook | EditMealFormPropsWithState;

const EditMealForm = (props: EditMealFormProps) => {
  // Check which type of props we're dealing with
  const isFormHook = 'register' in props;
  
  if (isFormHook) {
    // Handle form-hook based props
    const {
      register,
      errors,
      watch,
      setValue,
      date,
      onDateChange,
      onImageUrlChange,
      onImageError
    } = props;
    
    const image = watch('image');
    const mealType = watch('mealType');
    
    // Handle scraped data from recipe URL
    const handleScrapedData = (data: any) => {
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
  } else {
    // Handle direct state management props
    const {
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
    } = props;
    
    const handleImageError = () => {
      setEditImage('');
    };
    
    const handleImageUrlChange = (url: string) => {
      setEditImage(url);
    };
    
    const handleScrapedData = (data: any) => {
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
  }
};

export default EditMealForm;
