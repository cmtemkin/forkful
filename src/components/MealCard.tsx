
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ThumbsUp, ThumbsDown, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [imageError, setImageError] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const { toast } = useToast();
  
  const generatePlaceholderColor = (title: string) => {
    // Generate a deterministic color based on the title
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate hue (0-360), high saturation and light
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 80%)`;
  };
  
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
  
  return (
    <Link to={`/meal/${id}`} className="block">
      <div className="meal-card">
        <div className="w-20 h-20 rounded-lg overflow-hidden">
          {image && !imageError ? (
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: generatePlaceholderColor(title) }}
            >
              <ImageIcon className="h-6 w-6 text-white/70" />
            </div>
          )}
        </div>
        
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
              <button 
                className={`vote-button upvote mr-1 ${userVote === 'up' ? 'bg-chow-upvote/30' : ''}`}
                disabled={isLocked}
                onClick={handleUpvote}
              >
                <ThumbsUp className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">{localUpvotes}</span>
            </div>
            <div className="flex items-center">
              <button 
                className={`vote-button downvote mr-1 ${userVote === 'down' ? 'bg-chow-downvote/30' : ''}`}
                disabled={isLocked}
                onClick={handleDownvote}
              >
                <ThumbsDown className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">{localDownvotes}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MealCard;
