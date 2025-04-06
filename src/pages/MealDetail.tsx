
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MealDetailHeader from '@/components/meal/MealDetailHeader';
import MealImageSection from '@/components/meal/MealImageSection';
import MealInfoCard from '@/components/meal/MealInfoCard';
import MealIngredientsList from '@/components/meal/MealIngredientsList';
import EditMealForm from '@/components/meal/EditMealForm';
import AddToGroceryButton from '@/components/meal/AddToGroceryButton';
import { useMealDetails } from '@/hooks/useMealDetails';

const MealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
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
  } = useMealDetails(id);

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
        <Button onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div className="pb-20">
      <MealDetailHeader
        title={meal.title}
        id={meal.id}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        handleDelete={handleDelete}
        handleSaveEdits={handleSaveEdits}
      />
      
      <div className="p-4">
        {isEditing ? (
          <EditMealForm
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editMealType={editMealType}
            setEditMealType={setEditMealType}
            editDate={editDate}
            setEditDate={setEditDate}
            editIngredients={editIngredients}
            setEditIngredients={setEditIngredients}
            editImage={editImage}
            setEditImage={setEditImage}
          />
        ) : (
          <div className="space-y-6">
            <MealImageSection 
              image={meal.image} 
              title={meal.title} 
            />
            
            <MealInfoCard
              day={meal.day}
              mealType={meal.mealType}
              upvotes={meal.upvotes}
              downvotes={meal.downvotes}
              isPicked={meal.isPicked}
              handleVote={handleVote}
              togglePick={togglePick}
            />
            
            <MealIngredientsList ingredients={meal.ingredients} />
            
            <AddToGroceryButton onClick={addToGroceryList} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MealDetail;
