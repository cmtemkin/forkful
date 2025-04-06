
import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import DateSelector from '@/components/meal/DateSelector';
import MealTypeSelector from '@/components/meal/MealTypeSelector';
import RecipeImagePreview from '@/components/meal/RecipeImagePreview';
import { format } from 'date-fns';
import { useSupabaseStorage } from '@/hooks/useSupabaseStorage';
import { createMeal } from '@/services/mealService';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AddMeal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { uploadImage, isUploading } = useSupabaseStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const queryParams = new URLSearchParams(location.search);
  const defaultDay = queryParams.get('day') || '';
  const defaultMealType = queryParams.get('mealType') || '';
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [mealType, setMealType] = useState(defaultMealType || "Dinner");
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add a meal",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a meal name",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Process ingredients - split by commas and newlines
      const processedIngredients = ingredients
        .split(/[\n,]+/)
        .map(item => item.trim())
        .filter(item => item !== '');
      
      // Upload image if present
      let finalImageUrl = imageUrl;
      if (imageFile) {
        try {
          const uploadedUrl = await uploadImage(imageFile);
          if (uploadedUrl) {
            finalImageUrl = uploadedUrl;
          }
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast({
            title: "Warning",
            description: "Failed to upload image, but will continue saving the meal.",
            variant: "default"
          });
        }
      }
      
      const mealData = {
        title: title.trim(),
        ingredients: processedIngredients,
        image_path: finalImageUrl || null,
        meal_type: mealType,
        day: date ? format(date, 'EEEE').substring(0, 3) : 'Mon'
      };
      
      console.log('Creating meal with data:', mealData);
      
      // Create new meal in Supabase
      await createMeal(mealData);
      
      toast({
        title: "Success!",
        description: "Meal idea added to calendar",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error adding meal:', error);
      let errorMessage = "Failed to add meal. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelected = (file: File) => {
    setImageFile(file);
    // Create a temporary object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
  };

  return (
    <div className="pb-20">
      {/* Header with intuitive Apple-like styling */}
      <div className="bg-primary text-white px-4 py-3 flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold">Add New Idea</h1>
      </div>
      
      {error && (
        <Alert className="m-4 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Date selection */}
        <DateSelector 
          date={date} 
          onDateChange={setDate} 
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
            className="rounded-xl"
          />
        </div>
        
        {/* Image preview */}
        <div>
          <label className="block text-sm font-medium mb-1">Recipe Image</label>
          <div className="w-full max-h-48 rounded-xl overflow-hidden">
            <RecipeImagePreview 
              imageUrl={imageUrl}
              title={title}
              onError={() => setImageUrl("")}
              onImageSelected={handleImageSelected}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Ingredients (separated by commas or new lines)</label>
          <Textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="List ingredients, separated by commas or new lines"
            className="min-h-[100px] rounded-xl"
          />
          <p className="text-xs text-slate-500 mt-1">Press Enter or use commas for multiple ingredients</p>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-full shadow-md"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting || isUploading ? "Adding..." : "Add Idea"}
        </Button>
      </form>
    </div>
  );
};

export default AddMeal;
