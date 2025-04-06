
import React from 'react';
import { format, addWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '@/contexts/CalendarContext';

const WeekNavigation = () => {
  const { currentWeekStart, nextWeek, prevWeek } = useCalendar();
  
  const startDateFormatted = format(currentWeekStart, 'MMM d');
  const endDateFormatted = format(addWeeks(currentWeekStart, 1), 'MMM d');

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
      <button 
        onClick={prevWeek}
        className="h-9 w-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
        aria-label="Previous week"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <div className="text-base font-semibold text-gray-800">
        {startDateFormatted} - {endDateFormatted}
      </div>
      
      <button 
        onClick={nextWeek}
        className="h-9 w-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
        aria-label="Next week"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default WeekNavigation;
