
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Meal {
  id: string;
  title: string;
  image?: string;
  day: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  ingredients: string[];
  isPicked?: boolean;
  pickedByUserId?: string;
  pickedAt?: string;
  upvotes: number;
  downvotes: number;
  submittedBy?: string;
  dateAdded?: string;
}

export function useMealDetails(id: string | undefined) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [editTitle, setEditTitle] = useState('');
  const [editMealType, setEditMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Breakfast');
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [editIngredients, setEditIngredients] = useState('');
  const [editImage, setEditImage] = useState('');
  
  useEffect(() => {
    try {
      const storedMeals = localStorage.getItem('forkful_meals');
      if (storedMeals) {
        const meals = JSON.parse(storedMeals) as Meal[];
        const foundMeal = meals.find(m => m.id === id);
        
        if (foundMeal) {
          setMeal(foundMeal);
          
          setEditTitle(foundMeal.title);
          setEditMealType(foundMeal.mealType);
          setEditDate(foundMeal.day ? parseDayToDate(foundMeal.day) : undefined);
          // Ensure ingredients array exists before joining
          setEditIngredients(foundMeal.ingredients ? foundMeal.ingredients.join('\n') : '');
          setEditImage(foundMeal.image || '');
        } else {
          setError('Meal not found');
        }
      } else {
        setError('No meals found');
      }
    } catch (err) {
      setError('Error loading meal data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  const parseDayToDate = (day: string): Date => {
    const today = new Date();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayIndex = daysOfWeek.indexOf(day);
    
    if (dayIndex >= 0) {
      const currentDayIndex = today.getDay();
      const diff = dayIndex - currentDayIndex;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + diff);
      return targetDate;
    }
    
    return today;
  };
  
  const togglePick = () => {
    if (!meal) return;
    
    try {
      const storedMeals = localStorage.getItem('forkful_meals');
      if (storedMeals) {
        const meals = JSON.parse(storedMeals) as Meal[];
        const updatedMeals = meals.map(m => 
          m.id === id ? { 
            ...m, 
            isPicked: !m.isPicked,
            pickedByUserId: !m.isPicked ? 'current-user' : undefined, // Would use actual user ID in a real app
            pickedAt: !m.isPicked ? new Date().toISOString() : undefined 
          } : m
        );
        
        localStorage.setItem('forkful_meals', JSON.stringify(updatedMeals));
        
        setMeal({ 
          ...meal, 
          isPicked: !meal.isPicked,
          pickedByUserId: !meal.isPicked ? 'current-user' : undefined,
          pickedAt: !meal.isPicked ? new Date().toISOString() : undefined 
        });
        
        if (!meal.isPicked) {
          // Meal is being picked
          console.log('Meal picked!');
          // The toast is handled by the PickMealButton component
        } else {
          // Meal is being unpicked
          toast({
            title: "Meal unpicked",
            description: "This meal has been removed from your calendar",
          });
        }
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update meal picked status",
        variant: "destructive"
      });
    }
  };
  
  const handleVote = (isUpvote: boolean) => {
    if (!meal) return;
    
    try {
      const storedMeals = localStorage.getItem('forkful_meals');
      if (storedMeals) {
        const meals = JSON.parse(storedMeals) as Meal[];
        const updatedMeals = meals.map(m => {
          if (m.id === id) {
            if (isUpvote) {
              return { ...m, upvotes: m.upvotes + 1 };
            } else {
              return { ...m, downvotes: m.downvotes + 1 };
            }
          }
          return m;
        });
        
        localStorage.setItem('forkful_meals', JSON.stringify(updatedMeals));
        
        setMeal(prev => {
          if (!prev) return null;
          if (isUpvote) {
            return { ...prev, upvotes: prev.upvotes + 1 };
          } else {
            return { ...prev, downvotes: prev.downvotes + 1 };
          }
        });
        
        toast({
          title: isUpvote ? "Upvoted" : "Downvoted",
          description: `You've ${isUpvote ? 'upvoted' : 'downvoted'} this meal.`,
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to register vote",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveEdits = () => {
    if (!meal) return;
    
    try {
      const storedMeals = localStorage.getItem('forkful_meals');
      if (storedMeals) {
        const meals = JSON.parse(storedMeals) as Meal[];
        
        const processedIngredients = editIngredients
          .split(/[\n,]+/)
          .map(item => item.trim())
          .filter(item => item !== '');
        
        const updatedMeal = {
          ...meal,
          title: editTitle,
          mealType: editMealType,
          day: editDate ? format(editDate, 'EEEE').substring(0, 3) as any : meal.day,
          ingredients: processedIngredients,
          image: editImage
        };
        
        const updatedMeals = meals.map(m => 
          m.id === id ? updatedMeal : m
        );
        
        localStorage.setItem('forkful_meals', JSON.stringify(updatedMeals));
        
        setMeal(updatedMeal);
        setIsEditing(false);
        
        toast({
          title: "Changes saved",
          description: "Your changes to this meal have been saved.",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = () => {
    if (!meal) return;
    
    try {
      const storedMeals = localStorage.getItem('forkful_meals');
      if (storedMeals) {
        const meals = JSON.parse(storedMeals) as Meal[];
        const updatedMeals = meals.filter(m => m.id !== id);
        
        localStorage.setItem('forkful_meals', JSON.stringify(updatedMeals));
        
        toast({
          title: "Meal deleted",
          description: "The meal has been removed from your calendar.",
        });
        
        navigate('/calendar');
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete meal",
        variant: "destructive"
      });
    }
  };
  
  const addToGroceryList = () => {
    if (!meal) return;
    
    try {
      const storedItems = localStorage.getItem('chowdown_groceries');
      const existingItems = storedItems ? JSON.parse(storedItems) : [];
      
      const newItems = meal.ingredients.map(ing => ({
        id: `grocery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: ing,
        checked: false,
        recipe: meal.title
      }));
      
      const updatedItems = [...newItems, ...existingItems];
      
      localStorage.setItem('chowdown_groceries', JSON.stringify(updatedItems));
      
      toast({
        title: "Added to grocery list",
        description: `${newItems.length} ingredients from ${meal.title} added to your grocery list.`,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to add ingredients to grocery list",
        variant: "destructive"
      });
    }
  };
  
  return {
    meal,
    loading,
    error,
    isEditing,
    setIsEditing,
    showDeleteDialog,
    setShowDeleteDialog,
    editTitle,
    setEditTitle,
    editMealType,
    setEditMealType,
    editDate,
    setEditDate,
    editIngredients,
    setEditIngredients,
    editImage,
    setEditImage,
    togglePick,
    handleVote,
    handleSaveEdits,
    handleDelete,
    addToGroceryList,
  };
}
