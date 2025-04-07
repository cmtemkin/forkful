
import React from 'react';
import { ThumbsUp, Utensils } from 'lucide-react';

interface MealCardActionsProps {
  upvotes: number;
  isPicked?: boolean;
  onUpvote?: (e: React.MouseEvent) => void;
  onTogglePick?: (e: React.MouseEvent) => void;
  showPickButton?: boolean;
  isOverlayMode?: boolean;
}

const MealCardActions = ({ 
  upvotes, 
  isPicked = false, 
  onUpvote, 
  onTogglePick, 
  showPickButton = true,
  isOverlayMode = false
}: MealCardActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      {upvotes > 0 && (
        <button 
          className={`flex items-center ${isOverlayMode ? 'bg-white/20 text-white' : 'text-pistachio-green'} rounded-full px-2 py-0.5`}
          onClick={onUpvote}
          disabled={!onUpvote}
        >
          <ThumbsUp className="h-3 w-3 mr-1" /> 
          <span className="text-xs">{upvotes}</span>
        </button>
      )}
      
      {showPickButton && onTogglePick && (
        <button 
          onClick={onTogglePick}
          className="p-1"
        >
          <div className={`flex items-center justify-center h-7 w-7 rounded-lg ${
            isPicked 
              ? 'bg-primary-coral text-white' 
              : isOverlayMode 
                ? 'bg-white/20 text-white' 
                : 'bg-slate-accent/10 text-slate-accent border border-slate-accent/30'
          }`}>
            <Utensils className="h-4 w-4" />
          </div>
        </button>
      )}
      
      {!showPickButton && isPicked && (
        <div className="bg-primary-coral text-white rounded-full p-1">
          <Utensils className="h-3 w-3" />
        </div>
      )}
    </div>
  );
};

export default MealCardActions;
