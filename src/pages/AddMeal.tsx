
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import LoadingSpinner from '@/components/LoadingSpinner';
import { scrapeRecipe } from '@/utils/recipeScraperService';

const AddMeal = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    
    // Here you would typically send the data to your backend
    console.log({ date, mealType, title, ingredients, recipeUrl, imageUrl });
    
    // Show success toast and navigate back
    toast({
      title: "Success!",
      description: "Meal idea added to calendar",
    });
    navigate('/');
  };
  
  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setRecipeUrl(url);
    
    // Only attempt to scrape if the URL is reasonably valid
    if (url && url.includes('http') && (url.includes('.com') || url.includes('.org') || url.includes('.net'))) {
      await scrapeRecipeData(url);
    }
  };
  
  const scrapeRecipeData = async (url: string) => {
    setIsScraping(true);
    
    try {
      const scrapedData = await scrapeRecipe(url);
      
      if (scrapedData) {
        // Only update fields if they're not already filled in
        if (!title) setTitle(scrapedData.title);
        
        if (!ingredients) {
          const ingredientsList = scrapedData.ingredients.join('\n');
          setIngredients(ingredientsList);
        }
        
        if (scrapedData.image) {
          setImageUrl(scrapedData.image);
        }
        
        toast({
          title: "Recipe Details Loaded",
          description: "Successfully imported recipe information",
        });
      } else {
        toast({
          title: "Couldn't Load Recipe",
          description: "Please enter recipe details manually",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error scraping recipe:", error);
      toast({
        title: "Error",
        description: "Failed to extract recipe details. Please enter manually.",
        variant: "destructive",
      });
    } finally {
      setIsScraping(false);
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
        <div>
          <label className="block text-sm font-medium mb-1">Day</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {date ? format(date, 'EEEE, MMM d, yyyy') : 'Select a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Meal type selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Meal Type</label>
          <Select value={mealType} onValueChange={setMealType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select meal type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Breakfast">Breakfast</SelectItem>
              <SelectItem value="Lunch">Lunch</SelectItem>
              <SelectItem value="Dinner">Dinner</SelectItem>
              <SelectItem value="Snacks">Snacks</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Recipe URL for scraping */}
        <div>
          <label className="block text-sm font-medium mb-1">Recipe URL (optional)</label>
          <div className="relative">
            <Input
              value={recipeUrl}
              onChange={handleUrlChange}
              placeholder="Paste a link to automatically fetch details"
              type="url"
              disabled={isScraping}
            />
            {isScraping && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-chow-primary"></div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Paste a recipe URL to automatically extract details
          </p>
        </div>
        
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
        {imageUrl && (
          <div>
            <label className="block text-sm font-medium mb-1">Recipe Image</label>
            <div className="w-full aspect-square max-w-xs mx-auto bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={imageUrl} 
                alt={title || "Recipe"} 
                className="w-full h-full object-cover"
                onError={() => setImageUrl("")} // Clear image on error
              />
            </div>
          </div>
        )}
        
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
          {isScraping ? <LoadingSpinner /> : "Add to Calendar"}
        </Button>
      </form>
    </div>
  );
};

export default AddMeal;
