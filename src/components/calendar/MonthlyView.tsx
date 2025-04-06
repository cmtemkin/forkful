
import React from 'react';
import { format, getDaysInMonth, startOfMonth, isSameDay, isToday, addDays, addMonths, subMonths } from 'date-fns';
import { useCalendar } from '@/contexts/CalendarContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MonthlyView = () => {
  const { currentDate, setCurrentDate, setCurrentView, getMealsForDay } = useCalendar();

  // Get current month details
  const monthStart = startOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);
  const startDay = monthStart.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const adjustedStartDay = (startDay === 0) ? 6 : startDay - 1; // Adjust for Monday start
  
  // Generate array of days for the calendar
  const days = [];
  for (let i = 0; i < adjustedStartDay; i++) {
    days.push(null); // Empty cells for days before the 1st of the month
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    days.push(date);
  }
  
  // Calculate rows needed (including header)
  const rows = Math.ceil((days.length) / 7);
  
  // Create week rows
  const weeks = [];
  for (let i = 0; i < rows; i++) {
    weeks.push(days.slice(i * 7, (i + 1) * 7));
  }
  
  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
    setCurrentView('daily');
  };
  
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  return (
    <div className="flex flex-col w-full">
      <div className="bg-white px-4 py-6 border-b">
        <div className="flex items-center justify-between">
          <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h1>
          <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 text-center mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="rounded-lg overflow-hidden border border-gray-200">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7">
              {week.map((day, dayIndex) => {
                if (!day) {
                  return <div key={`empty-${dayIndex}`} className="bg-gray-50 h-16 border-t border-r" />;
                }
                
                const isSelected = isSameDay(day, currentDate);
                const isCurrentDay = isToday(day);
                const hasMeals = getMealsForDay(day).length > 0;
                
                return (
                  <button
                    key={day.toString()}
                    className={`h-16 flex flex-col items-center justify-center border-t border-r ${
                      isSelected 
                        ? 'bg-chow-primary text-white' 
                        : isCurrentDay 
                          ? 'bg-orange-50' 
                          : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleDateClick(day)}
                  >
                    <span className={`text-sm ${isSelected ? 'font-bold text-white' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {hasMeals && !isSelected && (
                      <div className="h-1 w-1 bg-chow-primary rounded-full mt-1"></div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyView;
