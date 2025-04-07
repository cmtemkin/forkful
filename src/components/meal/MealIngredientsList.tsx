
import React from 'react';

interface MealIngredientsListProps {
  ingredients: string[];
  instructions?: string[];
}

const MealIngredientsList = ({ ingredients = [], instructions = [] }: MealIngredientsListProps) => {
  // Ensure ingredients is always an array, even if undefined is passed
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];
  const safeInstructions = Array.isArray(instructions) ? instructions : [];
  
  return (
    <div className="space-y-6">
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
      
      {safeInstructions.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-2">Instructions</h2>
          <ol className="space-y-3">
            {safeInstructions.map((instruction, index) => (
              <li key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex">
                  <span className="font-semibold text-primary-coral mr-3">{index + 1}.</span>
                  <span>{instruction}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default MealIngredientsList;
