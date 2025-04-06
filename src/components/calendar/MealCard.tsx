
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, Utensils } from 'lucide-react';
import PickMealButton from '../meal/PickMealButton';

interface MealCardProps {
  id?: string;
  title: string;
  image?: string;
  upvotes: number;
  isPicked?: boolean;
  onTogglePick?: () => void;
}

const MealCard = ({ id, title, image, upvotes, isPicked = false, onTogglePick }: MealCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add upvote logic here
    console.log('Upvoted:', id, title);
  };
  
  const handleTogglePick = (e: React.MouseEvent) => {
    if (e && onTogglePick) {
      e.preventDefault();
      e.stopPropagation();
      onTogglePick();
    }
  };
  
  // Determine if we should show image or compact card
  const hasImage = image && !imageError;
  
  // No ID means not clickable (placeholder)
  if (!id) {
    return (
      <div className={`relative w-full ${hasImage ? 'h-24' : 'py-3'} rounded-xl overflow-hidden shadow-sm ${!hasImage ? 'bg-white border border-gray-200' : ''}`}>
        {hasImage ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="px-3 py-1">
            <h3 className="text-gray-800 font-medium text-lg">{title}</h3>
          </div>
        )}
        
        {hasImage && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium text-lg">{title}</h3>
              
              <div className="flex items-center space-x-2">
                {upvotes > 0 && (
                  <div className="flex items-center bg-white/20 text-white rounded-full px-2 py-0.5">
                    <ThumbsUp className="h-3 w-3 mr-1" /> 
                    <span className="text-xs">{upvotes}</span>
                  </div>
                )}
                
                {isPicked && (
                  <div className="bg-primary-coral text-white rounded-full p-1">
                    <Utensils className="h-3 w-3" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <Link to={`/meal/${id}`} className="block">
      <div className={`relative w-full ${hasImage ? 'h-24' : 'py-3'} rounded-xl overflow-hidden shadow-sm ${!hasImage ? 'bg-white border border-gray-200' : ''}`}>
        {hasImage ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="px-3 py-1">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-800 font-medium text-lg">{title}</h3>
              
              <div className="flex items-center space-x-2">
                {upvotes > 0 && (
                  <button 
                    className="flex items-center text-pistachio-green rounded-full px-2 py-0.5"
                    onClick={handleUpvote}
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" /> 
                    <span className="text-xs">{upvotes}</span>
                  </button>
                )}
                
                {onTogglePick && (
                  <button 
                    onClick={handleTogglePick}
                    className="p-1"
                  >
                    <PickMealButton 
                      isPicked={isPicked} 
                      onTogglePick={() => {}} 
                      disabled={true}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {hasImage && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium text-lg">{title}</h3>
              
              <div className="flex items-center space-x-2">
                {upvotes > 0 && (
                  <button 
                    className="flex items-center bg-white/20 text-white rounded-full px-2 py-0.5"
                    onClick={handleUpvote}
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" /> 
                    <span className="text-xs">{upvotes}</span>
                  </button>
                )}
                
                {onTogglePick && (
                  <button 
                    onClick={handleTogglePick}
                    className="p-1"
                  >
                    <div className={`flex items-center justify-center h-5 w-5 rounded-full ${
                      isPicked ? 'bg-primary-coral text-white' : 'bg-white/20 text-white'
                    }`}>
                      <Utensils className="h-3 w-3" />
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default MealCard;
