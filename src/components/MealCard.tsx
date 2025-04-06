
import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ThumbsUp, ThumbsDown } from 'lucide-react';

interface MealCardProps {
  id: string;
  title: string;
  submittedBy: string;
  image: string;
  upvotes: number;
  downvotes: number;
  isLocked?: boolean;
  dayMealtime?: string;
}

const MealCard = ({
  id,
  title,
  submittedBy,
  image,
  upvotes,
  downvotes,
  isLocked = false,
  dayMealtime
}: MealCardProps) => {
  return (
    <Link to={`/meal/${id}`} className="block">
      <div className="meal-card">
        <img 
          src={image || "/placeholder.svg"} 
          alt={title}
          className="meal-image"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-gray-500">{submittedBy}</p>
            </div>
            {isLocked && (
              <Lock className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div className="flex gap-3 mt-2">
            <div className="flex items-center">
              <button className="vote-button upvote mr-1" disabled={isLocked}>
                <ThumbsUp className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">{upvotes}</span>
            </div>
            <div className="flex items-center">
              <button className="vote-button downvote mr-1" disabled={isLocked}>
                <ThumbsDown className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">{downvotes}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MealCard;
