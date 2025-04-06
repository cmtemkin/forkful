
import React from 'react';
import { Calendar, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PickMealButton from './PickMealButton';
import { motion } from 'framer-motion';

interface MealInfoCardProps {
  day: string;
  mealType: string;
  upvotes: number;
  downvotes: number;
  isPicked: boolean | undefined;
  handleVote: (isUpvote: boolean) => void;
  togglePick: () => void;
}

const MealInfoCard = ({ 
  day, 
  mealType, 
  upvotes, 
  downvotes, 
  isPicked, 
  handleVote, 
  togglePick 
}: MealInfoCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-4">
        {/* Day and Meal Type Badges */}
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center rounded-full bg-muted-peach/20 px-3 py-1.5 text-sm font-medium text-muted-peach">
            <Calendar className="h-4 w-4 mr-1" />
            {day}
          </div>
          
          <div className="inline-flex items-center rounded-full bg-warm-white px-3 py-1.5 text-sm font-medium text-charcoal-gray">
            <Clock className="h-4 w-4 mr-1" />
            {mealType}
          </div>
        </div>
        
        {/* Interaction Area */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleVote(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-pistachio-green/10"
            >
              <ThumbsUp className="h-5 w-5 text-pistachio-green" />
              <span className="text-sm font-medium">{upvotes}</span>
            </button>
            
            <button 
              onClick={() => handleVote(false)}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary-coral/10"
            >
              <ThumbsDown className="h-5 w-5 text-primary-coral" />
              <span className="text-sm font-medium">{downvotes}</span>
            </button>
          </div>
          
          {/* Pick Meal Button */}
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={togglePick}
          >
            <PickMealButton 
              isPicked={!!isPicked} 
              onTogglePick={togglePick} 
            />
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealInfoCard;
