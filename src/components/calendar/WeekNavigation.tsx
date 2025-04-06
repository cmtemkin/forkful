
import React from 'react';
import { format, addWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '@/contexts/CalendarContext';
import { useIsMobile } from '@/hooks/use-mobile';

const WeekNavigation = () => {
  const { currentWeekStart, nextWeek, prevWeek } = useCalendar();
  const isMobile = useIsMobile();
  
  const startDateFormatted = format(currentWeekStart, isMobile ? 'MMM d' : 'MMMM d');
  const endDateFormatted = format(addWeeks(currentWeekStart, 1), isMobile ? 'MMM d' : 'MMMM d');

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
      <button 
        onClick={prevWeek}
        className="h-8 w-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <div className="text-sm font-medium">
        {startDateFormatted} - {endDateFormatted}
      </div>
      
      <button 
        onClick={nextWeek}
        className="h-8 w-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default WeekNavigation;
