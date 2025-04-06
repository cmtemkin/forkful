
import React, { useState } from 'react';
import { Calendar, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface PickMealButtonProps {
  isPicked: boolean;
  onTogglePick: () => void;
  disabled?: boolean;
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

const PickMealButton = ({ isPicked, onTogglePick, disabled = false }: PickMealButtonProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleToggle = () => {
    if (disabled) return;
    
    onTogglePick();
    
    if (!isPicked) { // About to become picked (state hasn't updated yet)
      const msg = getRandomMessage();
      setMessage(msg);
      setShowMessage(true);
      
      toast({
        title: "Meal picked!",
        description: msg,
        duration: 2000,
      });
      
      // Hide the message after animation
      setTimeout(() => {
        setShowMessage(false);
      }, 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        disabled={disabled}
        aria-label={isPicked ? "Unpick this meal" : "Pick this meal"}
        className={`flex items-center justify-center h-10 w-10 rounded-full transition-all ${
          isPicked 
            ? 'bg-primary-coral text-white shadow-md' 
            : 'bg-transparent text-slate-accent border border-slate-accent/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
      >
        {isPicked ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Check className="h-5 w-5" />
          </motion.div>
        ) : (
          <Calendar className="h-5 w-5" />
        )}
      </button>
      
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white text-charcoal-gray px-3 py-1 rounded-full shadow-md text-sm font-medium"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PickMealButton;
