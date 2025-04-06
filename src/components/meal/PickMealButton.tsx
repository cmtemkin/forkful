
import React, { useState } from 'react';
import { Utensils, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PickMealButtonProps {
  isPicked: boolean;
  onTogglePick: () => void;
  disabled?: boolean;
  className?: string;
}

const successMessages = [
  "Let's eat!",
  "Winner, winner, dinner's picked!",
  "Locked and loaded 🍴",
  "Chef's choice 🔥",
  "The table is set.",
  "This one's a go!",
  "Yesss! Let's make it.",
  "Everyone's on board.",
  "Can't wait for this one 🤤",
  "Menu secured!",
  "This meal's the vibe.",
  "Serving up greatness.",
  "Stamped & scheduled!"
];

const getRandomMessage = () => {
  return successMessages[Math.floor(Math.random() * successMessages.length)];
};

const PickMealButton = ({ 
  isPicked, 
  onTogglePick, 
  disabled = false, 
  className 
}: PickMealButtonProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const { toast } = useToast();

  const handleToggle = () => {
    if (disabled) return;
    
    onTogglePick();
    
    if (!isPicked) { // About to become picked (state hasn't updated yet)
      const msg = getRandomMessage();
      
      toast({
        title: "Meal picked!",
        description: msg,
        duration: 2000,
      });
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleToggle}
        disabled={disabled}
        aria-label={isPicked ? "Unpick this meal" : "Pick this meal"}
        className={cn(`flex items-center justify-center h-12 w-12 rounded-xl transition-all ${
          isPicked 
            ? 'bg-primary-coral text-white shadow-md' 
            : 'bg-slate-accent/10 text-slate-accent border border-slate-accent/30'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`, className)}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        {isPicked ? (
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Utensils className="h-6 w-6" />
          </motion.div>
        ) : (
          <Utensils className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  );
};

export default PickMealButton;

