
import { useToast } from '@/hooks/use-toast';
import { Meal } from '@/utils/mealUtils';

export function useGroceryList() {
  const { toast } = useToast();
  
  const addToGroceryList = (meal: Meal | null) => {
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
  
  return { addToGroceryList };
}
