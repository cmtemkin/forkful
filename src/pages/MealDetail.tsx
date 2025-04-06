
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, Lock, Unlock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '../components/LoadingSpinner';

// Sample data - in a real app, this would come from an API
const mockMealData = {
  id: '1',
  title: 'Chicken Alfredo',
  image: 'https://source.unsplash.com/photo-1645112411341-6c4fd023882a',
  day: 'Monday',
  mealType: 'Dinner',
  ingredients: [
    'Fettucine',
    'Heavy cream',
    'Parmesan cheese',
    'Butter'
  ],
  upvotes: 5,
  downvotes: 0,
  isLocked: false,
  sourceUrl: 'https://example.com/chicken-alfredo'
};

const MealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [meal, setMeal] = useState<any>(null);
  const [isLocked, setIsLocked] = useState(false);
  
  useEffect(() => {
    // In a real app, fetch the meal data from your API here
    setTimeout(() => {
      setMeal(mockMealData);
      setIsLocked(mockMealData.isLocked);
      setIsLoading(false);
    }, 500);
  }, [id]);
  
  const toggleLock = () => {
    setIsLocked(!isLocked);
    // In a real app, you would update this in your database
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!meal) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Meal not found</h2>
        <p className="text-gray-500 mb-6">This meal may have been removed or does not exist</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }
  
  return (
    <div className="pb-20">
      {/* Header with back button */}
      <div className="fixed top-0 left-0 right-0 bg-white z-30 flex items-center px-4 py-3 border-b">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>
      
      {/* Meal image */}
      <div className="relative pt-12">
        <div className="bg-green-800 aspect-square">
          <img 
            src={meal.image || "/placeholder.svg"} 
            alt={meal.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Meal details */}
      <div className="px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">{meal.title}</h1>
        <div className="text-gray-600 mb-6">{meal.day} {meal.mealType}</div>
        
        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
        <ul className="mb-8">
          {meal.ingredients.map((ingredient: string, i: number) => (
            <li key={i} className="flex items-start mb-1">
              <span className="mr-2">•</span>
              <span>{ingredient}</span>
            </li>
          ))}
        </ul>
        
        {/* Voting buttons */}
        <div className="flex gap-4 mb-8">
          <Button 
            variant="outline" 
            className="flex-1 upvote border-chow-upvote/20"
            disabled={isLocked}
          >
            <ThumbsUp className="mr-2 h-5 w-5" />
            <span>{meal.upvotes}</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 downvote border-chow-downvote/20"
            disabled={isLocked}
          >
            <ThumbsDown className="mr-2 h-5 w-5" />
            <span>{meal.downvotes}</span>
          </Button>
        </div>
        
        {/* Admin actions */}
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="border-gray-300 hover:bg-gray-100"
            onClick={toggleLock}
          >
            {isLocked ? (
              <>
                <Unlock className="mr-2 h-5 w-5" />
                <span>Unlock This Meal</span>
              </>
            ) : (
              <>
                <Lock className="mr-2 h-5 w-5" />
                <span>Lock This Meal</span>
              </>
            )}
          </Button>
          
          {meal.sourceUrl && (
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
              onClick={() => window.open(meal.sourceUrl, '_blank')}
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              <span>View Original Recipe</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealDetail;
