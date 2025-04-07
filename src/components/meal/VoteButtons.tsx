
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface VoteButtonsProps {
  title: string;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  setUserVote: (vote: 'up' | 'down' | null) => void;
  setLocalUpvotes: (callback: (prev: number) => number) => void;
  setLocalDownvotes: (callback: (prev: number) => number) => void;
}

const VoteButtons = ({ 
  title,
  upvotes,
  downvotes,
  userVote,
  setUserVote,
  setLocalUpvotes,
  setLocalDownvotes
}: VoteButtonsProps) => {
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

  return (
    <div className="flex items-center gap-3">
      <button 
        className={`flex items-center gap-1 px-2 py-1 rounded-full ${
          userVote === 'up' ? 'bg-pistachio-green/20' : ''
        }`}
        onClick={handleUpvote}
      >
        <ThumbsUp className="h-5 w-5 text-pistachio-green" />
        <span className="text-sm font-medium">{upvotes}</span>
      </button>
      
      <button 
        className={`flex items-center gap-1 px-2 py-1 rounded-full ${
          userVote === 'down' ? 'bg-primary-coral/20' : ''
        }`}
        onClick={handleDownvote}
      >
        <ThumbsDown className="h-5 w-5 text-primary-coral" />
        <span className="text-sm font-medium">{downvotes}</span>
      </button>
    </div>
  );
};

export default VoteButtons;
