
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import AddMealForm from '@/components/meal/AddMealForm';
import AddMealHeader from '@/components/meal/AddMealHeader';

// Mock events - in a real app, this would come from a database
const mockEvents = [
  { id: '1', name: 'Summer BBQ', date: new Date(2025, 6, 15) },
  { id: '2', name: 'Game Night Dinner', date: new Date(2025, 4, 20) },
];

const AddMeal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const queryParams = new URLSearchParams(location.search);
  const defaultDay = queryParams.get('day') || '';
  const defaultMealType = queryParams.get('mealType') || '';
  const defaultEventId = queryParams.get('eventId') || '';
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [mealType, setMealType] = useState(defaultMealType || "Dinner");
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [recipeUrl, setRecipeUrl] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(defaultEventId);
  const [mode, setMode] = useState<'date' | 'event'>(defaultEventId ? 'event' : 'date');
  
  // Find the event object if eventId is provided
  useEffect(() => {
    if (defaultEventId) {
      const event = mockEvents.find(e => e.id === defaultEventId);
      if (event) {
        setDate(event.date);
      }
    }
  }, [defaultEventId]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a meal name",
        variant: "destructive"
      });
      return;
    }
    
    // Get current meals from localStorage or initialize with empty array
    const existingMeals = localStorage.getItem('forkful_meals');
    const meals = existingMeals ? JSON.parse(existingMeals) : [];
    
    // Process ingredients - split by commas and newlines
    const processedIngredients = ingredients
      .split(/[\n,]+/)
      .map(item => item.trim())
      .filter(item => item !== '');
    
    // Process instructions - split by newlines
    const processedInstructions = instructions
      .split(/\n+/)
      .map(item => item.trim())
      .filter(item => item !== '');
    
    // Create a new meal object
    const newMeal = {
      id: `meal-${Date.now()}`, // Generate a unique ID using timestamp
      title: title.trim(),
      submittedBy: 'You', // In a real app, this would be the user's name
      image: imageUrl || '',
      upvotes: 0,
      downvotes: 0,
      day: format(date || new Date(), 'EEEE').substring(0, 3) as any, // Convert to 'Mon', 'Tue', etc.
      mealType: mealType,
      ingredients: processedIngredients,
      instructions: processedInstructions,
      sourceUrl: recipeUrl || '',
      dateAdded: new Date().toISOString(),
      eventId: mode === 'event' ? selectedEvent : null,  // Add eventId if in event mode
    };
    
    // Add the new meal to the beginning of the array
    const updatedMeals = [newMeal, ...meals];
    
    // Save to localStorage
    localStorage.setItem('forkful_meals', JSON.stringify(updatedMeals));
    
    // Show success toast and navigate back
    toast({
      title: "Success!",
      description: "Meal idea added",
    });
    
    // Navigate to the right place
    if (mode === 'event' && selectedEvent) {
      navigate(`/event/${selectedEvent}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="pb-20">
      <AddMealHeader />
      
      <AddMealForm
        title={title}
        setTitle={setTitle}
        mealType={mealType}
        setMealType={setMealType}
        date={date}
        setDate={setDate}
        ingredients={ingredients}
        setIngredients={setIngredients}
        instructions={instructions}
        setInstructions={setInstructions}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        recipeUrl={recipeUrl}
        setRecipeUrl={setRecipeUrl}
        mode={mode}
        setMode={setMode}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        onSubmit={handleSubmit}
        events={mockEvents}
      />
    </div>
  );
};

export default AddMeal;
