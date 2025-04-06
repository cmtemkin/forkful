
import React from 'react';
import { Calendar, Clock, ThumbsUp, ThumbsDown, Lock, Unlock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
          <button 
            onClick={toggleLock}
            className={`flex items-center space-x-1 ${isLocked ? 'text-chow-primary' : 'text-gray-400'}`}
          >
            {isLocked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
            <span>{isLocked ? 'Locked' : 'Unlocked'}</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealInfoCard;
