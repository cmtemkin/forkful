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
    
    if (userVote === 'up') {
      setLocalUpvotes(prev => prev - 1);
      setUserVote(null);
      toast({
        title: "Upvote removed",
        description: `You removed your upvote from ${title}`,
      });
    } 
    else if (userVote === 'down') {
      setLocalUpvotes(prev => prev + 1);
      setLocalDownvotes(prev => prev - 1);
      setUserVote('up');
      toast({
        title: "Changed to upvote",
        description: `You changed your vote to upvote for ${title}`,
      });
    } 
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
    
    if (userVote === 'down') {
      setLocalDownvotes(prev => prev - 1);
      setUserVote(null);
      toast({
        title: "Downvote removed",
        description: `You removed your downvote from ${title}`,
      });
    } 
    else if (userVote === 'up') {
      setLocalDownvotes(prev => prev + 1);
      setLocalUpvotes(prev => prev - 1);
      setUserVote('down');
      toast({
        title: "Changed to downvote",
        description: `You changed your vote to downvote for ${title}`,
      });
    } 
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
          
          <div className="mb-2 pr-16">
            <h3 className="text-xl font-bold text-charcoal-gray leading-tight line-clamp-1">{title}</h3>
            <p className="text-sm text-slate-accent mt-0.5">{submittedBy}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {dayBadge}
            {mealTypeBadge}
          </div>
          
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
        </div>
      </motion.div>
    </Link>
  );
};

export default MealCard;
