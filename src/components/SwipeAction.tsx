
import React, { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

interface SwipeActionProps {
  children: React.ReactNode;
  onSwipe: () => void;
  threshold?: number;
}

export const SwipeAction: React.FC<SwipeActionProps> = ({ 
  children, 
  onSwipe,
  threshold = 100 
}) => {
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState<number | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Reset position when component unmounts or when onSwipe changes
  useEffect(() => {
    return () => {
      if (elementRef.current) {
        elementRef.current.style.transform = 'translateX(0)';
      }
    };
  }, [onSwipe]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX === null) return;
    
    const x = e.touches[0].clientX;
    const diff = x - startX;
    
    // Only allow left swipe (negative diff)
    if (diff < 0) {
      setCurrentX(x);
      if (elementRef.current) {
        elementRef.current.style.transform = `translateX(${diff}px)`;
      }
    }
  };
  
  const handleTouchEnd = () => {
    if (startX === null || currentX === null) return;
    
    const diff = currentX - startX;
    
    if (diff < -threshold) {
      // Swiped far enough, trigger action
      onSwipe();
    } else {
      // Not swiped far enough, reset position
      if (elementRef.current) {
        elementRef.current.style.transform = 'translateX(0)';
      }
    }
    
    setStartX(null);
    setCurrentX(null);
  };
  
  return (
    <div className="relative overflow-hidden">
      <div 
        ref={elementRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="bg-white transition-transform duration-200"
      >
        {children}
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center justify-center bg-chow-downvote text-white w-24">
        <Trash2 className="h-5 w-5" />
      </div>
    </div>
  );
};
