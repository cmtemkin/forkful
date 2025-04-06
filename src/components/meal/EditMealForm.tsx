
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MealTypeSelector from '@/components/meal/MealTypeSelector';
import DateSelector from '@/components/meal/DateSelector';
import RecipeImagePreview from '@/components/meal/RecipeImagePreview';

interface EditMealFormProps {
  editTitle: string;
  setEditTitle: (title: string) => void;
  editMealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  setEditMealType: (mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks') => void;
  editDate: Date | undefined;
  setEditDate: (date: Date | undefined) => void;
  editIngredients: string;
  setEditIngredients: (ingredients: string) => void;
  editImage: string;
  setEditImage: (image: string) => void;
}

const EditMealForm = ({
  editTitle,
  setEditTitle,
  editMealType,
  setEditMealType,
  editDate,
  setEditDate,
  editIngredients,
  setEditIngredients,
  editImage,
  setEditImage
}: EditMealFormProps) => {
  const handleMealTypeChange = (value: string) => {
    if (value === 'Breakfast' || value === 'Lunch' || value === 'Dinner' || value === 'Snacks') {
      setEditMealType(value);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Meal name</label>
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="e.g., Chicken Alfredo"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Recipe Image</label>
        <RecipeImagePreview
          imageUrl={editImage}
          title={editTitle}
          onError={() => setEditImage("")}
          onImageSelected={(file) => {
            const objectUrl = URL.createObjectURL(file);
            setEditImage(objectUrl);
          }}
        />
      </div>
      
      <MealTypeSelector 
        value={editMealType} 
        onChange={handleMealTypeChange} 
      />
      
      <DateSelector 
        date={editDate} 
        onDateChange={setEditDate} 
      />
      
      <div>
        <label className="block text-sm font-medium mb-1">Ingredients (separated by commas or new lines)</label>
        <Textarea
          value={editIngredients}
          onChange={(e) => setEditIngredients(e.target.value)}
          placeholder="List ingredients, separated by commas or new lines"
          className="min-h-[150px]"
        />
      </div>
    </div>
  );
};

export default EditMealForm;
