
import { useState, useEffect } from 'react';
import { findMealById, parseDayToDate } from '@/utils/mealUtils';
import { useMealToggle } from '@/hooks/useMealToggle';
import { useMealVote } from '@/hooks/useMealVote';
import { useMealEdit } from '@/hooks/useMealEdit';
import { useMealDelete } from '@/hooks/useMealDelete';
import { useGroceryList } from '@/hooks/useGroceryList';

export function useMealDetails(id: string | undefined) {
  const [meal, setMeal] = useState(findMealById(id));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Load initial meal data
  useEffect(() => {
    setLoading(true);
    try {
      const foundMeal = findMealById(id);
      
      if (foundMeal) {
        setMeal(foundMeal);
      } else {
        setError('Meal not found');
      }
    } catch (err) {
      setError('Error loading meal data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  // Create event listener for meal updates
  useEffect(() => {
    const handleMealUpdated = () => {
      const updatedMeal = findMealById(id);
      if (updatedMeal) {
        setMeal(updatedMeal);
      }
    };
    
    window.addEventListener('forkful-meals-updated', handleMealUpdated);
    return () => {
      window.removeEventListener('forkful-meals-updated', handleMealUpdated);
    };
  }, [id]);
  
  // Import functionality from other hooks
  const { togglePick } = useMealToggle(meal);
  const { handleVote } = useMealVote(meal);
  const { addToGroceryList } = useGroceryList();
  
  const {
    isEditing,
    setIsEditing,
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
    handleSaveEdits
  } = useMealEdit(meal);
  
  const {
    showDeleteDialog,
    setShowDeleteDialog,
    handleDelete
  } = useMealDelete(meal);
  
  // Wrapper functions that update local state after operations
  const handleTogglePick = () => {
    const updatedMeal = togglePick();
    if (updatedMeal) setMeal(updatedMeal);
  };
  
  const handleVoteWrapper = (isUpvote: boolean) => {
    const updatedMeal = handleVote(isUpvote);
    if (updatedMeal) setMeal(updatedMeal);
  };
  
  const handleSaveEditsWrapper = () => {
    const updatedMeal = handleSaveEdits();
    if (updatedMeal) setMeal(updatedMeal);
  };
  
  const handleAddToGroceryList = () => {
    addToGroceryList(meal);
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
    togglePick: handleTogglePick,
    handleVote: handleVoteWrapper,
    handleSaveEdits: handleSaveEditsWrapper,
    handleDelete,
    addToGroceryList: handleAddToGroceryList,
  };
}
