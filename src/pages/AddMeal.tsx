
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log({ date, mealType, title, ingredients, recipeUrl });
    
    // Show success toast and navigate back
    navigate('/');
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
        
        <div>
          <label className="block text-sm font-medium mb-1">Ingredients</label>
          <Textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="List ingredients, one per line"
            className="min-h-[100px]"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Recipe URL (optional)</label>
          <Input
            value={recipeUrl}
            onChange={(e) => setRecipeUrl(e.target.value)}
            placeholder="Paste a link to automatically fetch details"
            type="url"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-chow-primary hover:bg-chow-primary/90 text-white py-6 rounded-full"
        >
          Add to Calendar
        </Button>
      </form>
    </div>
  );
};

export default AddMeal;
