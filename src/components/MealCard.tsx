
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Utensils } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PickMealButton from './meal/PickMealButton';
import { motion } from 'framer-motion';

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
  const { toast } = useToast();
  
  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If already upvoted, remove upvote
    if (userVote === 'up') {
      setLocalUpvotes(prev => prev - 1);
      setUserVote(null);
      toast({
        title: "Upvote removed",
        description: `You removed your upvote from ${title}`,
      });
    } 
    // If previously downvoted, switch to upvote
    else if (userVote === 'down') {
      setLocalUpvotes(prev => prev + 1);
      setLocalDownvotes(prev => prev - 1);
      setUserVote('up');
      toast({
        title: "Changed to upvote",
        description: `You changed your vote to upvote for ${title}`,
      });
    } 
    // If no previous vote, add upvote
    else {
      setLocalUpvotes(prev => prev + 1);
      setUserVote('up');
      toast({
        title: "Upvoted",
        description: `You upvoted ${title}`,
      });
    }
  };
  
  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If already downvoted, remove downvote
    if (userVote === 'down') {
      setLocalDownvotes(prev => prev - 1);
      setUserVote(null);
      toast({
        title: "Downvote removed",
        description: `You removed your downvote from ${title}`,
      });
    } 
    // If previously upvoted, switch to downvote
    else if (userVote === 'up') {
      setLocalDownvotes(prev => prev + 1);
      setLocalUpvotes(prev => prev - 1);
      setUserVote('down');
      toast({
        title: "Changed to downvote",
        description: `You changed your vote to downvote for ${title}`,
      });
    } 
    // If no previous vote, add downvote
    else {
      setLocalDownvotes(prev => prev + 1);
      setUserVote('down');
      toast({
        title: "Downvoted",
        description: `You downvoted ${title}`,
      });
    }
  };
  
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
        className="meal-card bg-white rounded-xl shadow-sm border border-slate-accent/10 p-4 mb-4"
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative">
          {/* Title and Contributor Area */}
          <div className="mb-2">
            <h3 className="text-xl font-bold text-charcoal-gray leading-tight line-clamp-1">{title}</h3>
            <p className="text-sm text-slate-accent mt-0.5">{submittedBy}</p>
          </div>
          
          {/* Badges Row */}
          <div className="flex flex-wrap gap-2 mb-3">
            {dayBadge}
            {mealTypeBadge}
          </div>
          
          {/* Interactions Area */}
          <div className="flex justify-between items-center">
            {/* Voting Controls */}
            <div className="flex items-center gap-3">
              <button 
                className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                  userVote === 'up' ? 'bg-pistachio-green/20' : ''
                }`}
                onClick={handleUpvote}
              >
                <ThumbsUp className="h-5 w-5 text-pistachio-green" />
                <span className="text-sm font-medium">{localUpvotes}</span>
              </button>
              
              <button 
                className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                  userVote === 'down' ? 'bg-primary-coral/20' : ''
                }`}
                onClick={handleDownvote}
              >
                <ThumbsDown className="h-5 w-5 text-primary-coral" />
                <span className="text-sm font-medium">{localDownvotes}</span>
              </button>
            </div>
            
            {/* Pick Button */}
            {onTogglePick && (
              <div 
                className="absolute bottom-0 right-0" 
                onClick={handlePickToggle}
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  <PickMealButton 
                    isPicked={isPicked} 
                    onTogglePick={() => {}} 
                    disabled={true}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default MealCard;
