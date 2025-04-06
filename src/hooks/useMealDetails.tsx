
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { getMealById, updateMeal, deleteMeal, voteMeal } from '@/services/mealService';

interface Meal {
  id: string;
  title: string;
  image_path?: string;
  day: string;
  meal_type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  ingredients: string[];
  isLocked?: boolean;
  upvotes: number;
  downvotes: number;
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
    const fetchMeal = async () => {
      if (!id) {
        setError('No meal ID provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const fetchedMeal = await getMealById(id);
        
        if (fetchedMeal) {
          setMeal({
            ...fetchedMeal,
            isLocked: false // We don't store lock status in DB yet
          });
          
          setEditTitle(fetchedMeal.title);
          setEditMealType(fetchedMeal.meal_type as 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks');
          setEditDate(fetchedMeal.day ? parseDayToDate(fetchedMeal.day) : undefined);
          setEditIngredients(fetchedMeal.ingredients ? fetchedMeal.ingredients.join('\n') : '');
          setEditImage(fetchedMeal.image_path || '');
        } else {
          setError('Meal not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading meal data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeal();
  }, [id]);
  
  const parseDayToDate = (day: string): Date => {
    const today = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
  
  const toggleLock = () => {
    if (!meal) return;
    
    try {
      setMeal({ ...meal, isLocked: !meal.isLocked });
      
      toast({
        title: meal.isLocked ? "Meal unlocked" : "Meal locked",
        description: meal.isLocked 
          ? "This meal can now be changed" 
          : "This meal is now locked and will appear in your grocery list",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update meal locked status",
        variant: "destructive"
      });
    }
  };
  
  const handleVote = async (isUpvote: boolean) => {
    if (!meal || !id) return;
    
    try {
      await voteMeal(id, isUpvote ? 'upvote' : 'downvote');
      
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
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to register vote",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveEdits = async () => {
    if (!meal || !id) return;
    
    try {
      setLoading(true);
      
      const processedIngredients = editIngredients
        .split(/[\n,]+/)
        .map(item => item.trim())
        .filter(item => item !== '');
      
      const updatedMeal = {
        title: editTitle,
        meal_type: editMealType,
        day: editDate ? format(editDate, 'EEEE') : meal.day,
        ingredients: processedIngredients,
        image_path: editImage
      };
      
      const result = await updateMeal(id, updatedMeal);
      
      setMeal({
        ...result,
        isLocked: meal.isLocked
      });
      
      setIsEditing(false);
      
      toast({
        title: "Changes saved",
        description: "Your changes to this meal have been saved.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save changes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!meal || !id) return;
    
    try {
      setLoading(true);
      await deleteMeal(id);
      
      toast({
        title: "Meal deleted",
        description: "The meal has been removed from your calendar.",
      });
      
      navigate('/calendar');
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete meal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
    toggleLock,
    handleVote,
    handleSaveEdits,
    handleDelete,
    addToGroceryList,
  };
}
