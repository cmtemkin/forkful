
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PickMealButton from './meal/PickMealButton';
import VoteButtons from './meal/VoteButtons';
import MealBadges from './meal/MealBadges';
import MealCardTitle from './meal/MealCardTitle';

interface MealCardProps {
  id: string;
  title: string;
  submittedBy: string;
  image: string;
  upvotes: number;
  downvotes: number;
  isPicked?: boolean;
  onTogglePick?: () => void;
  dayBadge?: React.ReactNode;
  mealTypeBadge?: React.ReactNode;
}

const MealCard = ({
  id,
  title,
  submittedBy,
  image,
  upvotes,
  downvotes,
  isPicked = false,
  onTogglePick,
  dayBadge,
  mealTypeBadge
}: MealCardProps) => {
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  
  const handlePickToggle = (e: React.MouseEvent) => {
    if (e && onTogglePick) {
      e.preventDefault();
      e.stopPropagation();
      onTogglePick();
    }
  };
  
  return (
    <Link to={`/meal/${id}`} className="block">
      <motion.div 
        className="meal-card bg-white rounded-xl shadow-sm border border-slate-accent/10 p-4 mb-4 relative"
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative pr-16">
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            {onTogglePick && (
              <PickMealButton 
                isPicked={isPicked} 
                onTogglePick={() => {}} 
                className="absolute top-1/2 right-0 -translate-y-1/2"
              />
            )}
          </div>
          
          <MealCardTitle title={title} submittedBy={submittedBy} />
          
          <MealBadges dayBadge={dayBadge} mealTypeBadge={mealTypeBadge} />
          
          <VoteButtons
            title={title}
            upvotes={localUpvotes}
            downvotes={localDownvotes}
            userVote={userVote}
            setUserVote={setUserVote}
            setLocalUpvotes={setLocalUpvotes}
            setLocalDownvotes={setLocalDownvotes}
          />
        </div>
      </motion.div>
    </Link>
  );
};

export default MealCard;
