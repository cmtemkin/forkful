
import React from 'react';
import { format, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '@/contexts/CalendarContext';

const WeekNavigation = () => {
  const { currentWeekStart, nextWeek, prevWeek } = useCalendar();
  
  // Format the date range from Sunday to Saturday (6 days later)
  const startDateFormatted = format(currentWeekStart, 'MMM d');
  const endDateFormatted = format(addDays(currentWeekStart, 6), 'MMM d');

  return (
    <div className="flex items-center justify-between px-2 py-3 bg-white border-b border-gray-200">
      <button 
        onClick={prevWeek}
        className="h-8 w-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Previous week"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <div className="text-base font-semibold text-gray-800">
        {startDateFormatted} - {endDateFormatted}
      </div>
      
      <button 
        onClick={nextWeek}
        className="h-8 w-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Next week"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default WeekNavigation;
