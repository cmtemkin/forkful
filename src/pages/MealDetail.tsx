import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Lock, Unlock, ThumbsUp, ThumbsDown, Trash, Plus, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from '@/components/ui/card';
import MealTypeSelector from '@/components/meal/MealTypeSelector';
import DateSelector from '@/components/meal/DateSelector';
import RecipeImagePreview from '@/components/meal/RecipeImagePreview';
import { format, parse } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface Meal {
  id: string;
  title: string;
  image?: string;
  day: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  ingredients: string[];
  isLocked?: boolean;
  upvotes: number;
  downvotes: number;
  submittedBy?: string;
  dateAdded?: string;
}

const MealDetail = () => {
  const { id } = useParams<{ id: string }>();
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
          setEditIngredients(foundMeal.ingredients.join('\n'));
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
  
  const toggleLock = () => {
    if (!meal) return;
    
    try {
      const storedMeals = localStorage.getItem('forkful_meals');
      if (storedMeals) {
        const meals = JSON.parse(storedMeals) as Meal[];
        const updatedMeals = meals.map(m => 
          m.id === id ? { ...m, isLocked: !m.isLocked } : m
        );
        
        localStorage.setItem('forkful_meals', JSON.stringify(updatedMeals));
        
        setMeal({ ...meal, isLocked: !meal.isLocked });
        
        toast({
          title: meal.isLocked ? "Meal unlocked" : "Meal locked",
          description: meal.isLocked 
            ? "This meal can now be changed" 
            : "This meal is now locked and will appear in your grocery list",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update meal locked status",
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (error || !meal) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <p className="text-lg text-red-500 mb-4">{error || "Meal not found"}</p>
        <Button onClick={() => navigate('/calendar')}>
          Return to Calendar
        </Button>
      </div>
    );
  }
  
  return (
    <div className="pb-20">
      <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center">{isEditing ? "Edit Meal" : meal.title}</h1>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-primary-dark"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-primary-dark"
                onClick={handleSaveEdits}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-primary-dark"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-5 w-5" />
              </Button>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-primary-dark"
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete this meal?</DialogTitle>
                    <DialogDescription>
                      This will remove this meal from your calendar. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDelete}
                      className="bg-chow-downvote hover:bg-chow-downvote/90"
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {isEditing ? (
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
              onChange={(value) => {
                if (value === 'Breakfast' || value === 'Lunch' || value === 'Dinner' || value === 'Snacks') {
                  setEditMealType(value);
                }
              }} 
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
        ) : (
          <div className="space-y-6">
            <div className="relative w-full rounded-xl overflow-hidden aspect-video bg-gray-100">
              {meal.image ? (
                <img 
                  src={meal.image} 
                  alt={meal.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-gray-400 flex flex-col items-center">
                    <Plus className="h-8 w-8 mb-2" />
                    <span>No image available</span>
                  </div>
                </div>
              )}
            </div>
            
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>{meal.day}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span>{meal.mealType}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleVote(true)}
                      className="flex items-center space-x-1 text-chow-upvote"
                    >
                      <ThumbsUp className="h-5 w-5" />
                      <span>{meal.upvotes}</span>
                    </button>
                    <button 
                      onClick={() => handleVote(false)}
                      className="flex items-center space-x-1 text-chow-downvote"
                    >
                      <ThumbsDown className="h-5 w-5" />
                      <span>{meal.downvotes}</span>
                    </button>
                  </div>
                  <button 
                    onClick={toggleLock}
                    className={`flex items-center space-x-1 ${meal.isLocked ? 'text-chow-primary' : 'text-gray-400'}`}
                  >
                    {meal.isLocked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                    <span>{meal.isLocked ? 'Locked' : 'Unlocked'}</span>
                  </button>
                </div>
              </CardContent>
            </Card>
            
            <div>
              <h2 className="text-lg font-bold mb-2">Ingredients</h2>
              {meal.ingredients.length > 0 ? (
                <ul className="space-y-2">
                  {meal.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No ingredients listed</p>
              )}
            </div>
            
            <Button 
              onClick={addToGroceryList}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add to Grocery List
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealDetail;
