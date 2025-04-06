
import React from 'react';

interface MealIngredientsListProps {
  ingredients: string[];
}

const MealIngredientsList = ({ ingredients = [] }: MealIngredientsListProps) => {
  // Ensure ingredients is always an array, even if undefined is passed
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];
  
  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Ingredients</h2>
      {safeIngredients.length > 0 ? (
        <ul className="space-y-2">
          {safeIngredients.map((ingredient, index) => (
            <li key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <span>{ingredient}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No ingredients listed</p>
      )}
    </div>
  );
};

export default MealIngredientsList;
