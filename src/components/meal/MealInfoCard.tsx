
import React from 'react';
import { Calendar, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import Logo from '@/components/Logo';

interface MealInfoCardProps {
  day: string;
  mealType: string;
  upvotes: number;
  downvotes: number;
  isLocked: boolean | undefined;
  handleVote: (isUpvote: boolean) => void;
  toggleLock: () => void;
}

const MealInfoCard = ({ 
  day, 
  mealType, 
  upvotes, 
  downvotes, 
  isLocked, 
  handleVote, 
  toggleLock 
}: MealInfoCardProps) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span>{day}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <span>{mealType}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button 
              onClick={() => handleVote(true)}
              className="flex items-center space-x-1 text-chow-upvote"
            >
              <ThumbsUp className="h-5 w-5" />
              <span>{upvotes}</span>
            </button>
            <button 
              onClick={() => handleVote(false)}
              className="flex items-center space-x-1 text-chow-downvote"
            >
              <ThumbsDown className="h-5 w-5" />
              <span>{downvotes}</span>
            </button>
          </div>
          <Toggle 
            pressed={isLocked}
            onPressedChange={toggleLock}
            aria-label={isLocked ? "Unlock meal" : "Lock meal"}
            className="p-2 rounded-full data-[state=on]:bg-primary/10"
          >
            <Logo 
              size="small" 
              inverted 
              className={`transition-opacity ${isLocked ? 'opacity-100' : 'opacity-40'}`} 
            />
          </Toggle>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealInfoCard;
