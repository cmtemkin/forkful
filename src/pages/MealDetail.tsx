
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, Lock, Unlock, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { ImageIcon } from 'lucide-react';

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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [meal, setMeal] = useState<any>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    setTimeout(() => {
      setMeal(mockMealData);
      setIsLocked(mockMealData.isLocked);
      setIsLoading(false);
    }, 500);
  }, [id]);
  
  const toggleLock = () => {
    setIsLocked(!isLocked);
  };
  
  const handleDeleteMeal = () => {
    toast({
      title: "Meal deleted",
      description: "The meal has been successfully deleted.",
    });
    
    navigate('/calendar');
  };
  
  const generatePlaceholderColor = (title: string) => {
    let hash = 0;
    for (let i = 0; i < title?.length || 0; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 80%)`;
  };
  
  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Upvoted",
      description: `You upvoted ${meal?.title}`,
    });
  };
  
  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Downvoted",
      description: `You downvoted ${meal?.title}`,
    });
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
      <div className="fixed top-0 left-0 right-0 bg-white z-30 flex items-center px-4 py-3 border-b">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>
      
      <div className="relative pt-12">
        <div className="bg-green-800 aspect-square">
          {meal.image && !imageError ? (
            <img 
              src={meal.image} 
              alt={meal.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div 
              className="w-full h-full flex flex-col items-center justify-center p-4"
              style={{ backgroundColor: generatePlaceholderColor(meal.title) }}
            >
              <ImageIcon className="h-16 w-16 text-white/70 mb-2" />
              <span className="text-lg font-medium text-white text-center">{meal.title}</span>
            </div>
          )}
        </div>
      </div>
      
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
        
        <div className="flex gap-4 mb-8">
          <Button 
            variant="outline" 
            className="flex-1 upvote border-chow-upvote/20"
            disabled={isLocked}
            onClick={handleUpvote}
          >
            <ThumbsUp className="mr-2 h-5 w-5" />
            <span>{meal.upvotes}</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 downvote border-chow-downvote/20"
            disabled={isLocked}
            onClick={handleDownvote}
          >
            <ThumbsDown className="mr-2 h-5 w-5" />
            <span>{meal.downvotes}</span>
          </Button>
        </div>
        
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
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-chow-downvote/20 hover:bg-chow-downvote/10 text-chow-downvote"
              >
                <Trash2 className="mr-2 h-5 w-5" />
                <span>Delete This Meal</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the meal
                  from your calendar.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteMeal}
                  className="bg-chow-downvote text-white hover:bg-chow-downvote/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default MealDetail;
