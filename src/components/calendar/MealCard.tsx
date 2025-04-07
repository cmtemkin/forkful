
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, Utensils } from 'lucide-react';
import PickMealButton from '../meal/PickMealButton';
import { motion } from 'framer-motion';
import { useCalendar } from '@/contexts/CalendarContext';
import MealCardImage from '../meal/MealCardImage';
import MealCardActions from './MealCardActions';

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
  const { toggleMealPicked } = useCalendar();
  
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
    } else if (e && id) {
      e.preventDefault();
      e.stopPropagation();
      toggleMealPicked(id);
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
            <h3 className="text-charcoal-gray font-medium text-lg line-clamp-1">{title}</h3>
          </div>
        )}
        
        {hasImage && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium text-lg line-clamp-1">{title}</h3>
              
              <MealCardActions 
                upvotes={upvotes}
                isPicked={isPicked}
                showPickButton={false}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <Link to={`/meal/${id}`} className="block">
      <motion.div 
        className={`relative w-full ${hasImage ? 'h-24' : 'py-3'} rounded-xl overflow-hidden shadow-sm ${!hasImage ? 'bg-white border border-gray-200' : ''}`}
        whileTap={{ scale: 0.98 }}
      >
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
              <h3 className="text-charcoal-gray font-medium text-lg line-clamp-1">{title}</h3>
              
              <MealCardActions 
                upvotes={upvotes}
                isPicked={isPicked}
                onUpvote={handleUpvote}
                onTogglePick={handleTogglePick}
              />
            </div>
          </div>
        )}
        
        {hasImage && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium text-lg line-clamp-1">{title}</h3>
              
              <MealCardActions 
                upvotes={upvotes}
                isPicked={isPicked}
                onUpvote={handleUpvote}
                onTogglePick={handleTogglePick}
                isOverlayMode={true}
              />
            </div>
          </div>
        )}
      </motion.div>
    </Link>
  );
};

export default MealCard;
