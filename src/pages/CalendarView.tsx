
import React from 'react';
import { CalendarProvider, useCalendar } from '@/contexts/CalendarContext';
import WeeklyView from '@/components/calendar/WeeklyView';
import DailyView from '@/components/calendar/DailyView';
import MonthlyView from '@/components/calendar/MonthlyView';
import CalendarViewSelector from '@/components/calendar/CalendarViewSelector';
import WeekNavigation from '@/components/calendar/WeekNavigation';

const CalendarViewContent = () => {
  const { currentView } = useCalendar();

  return (
    <div className="flex flex-col min-h-screen bg-chow-background">
      {/* Calendar View Selector */}
      <CalendarViewSelector />
      
      {/* Week Navigation (only for weekly view) */}
      {currentView === 'weekly' && <WeekNavigation />}
      
      {/* Calendar Content */}
      <div className="flex-1 animate-fade-in">
        {currentView === 'weekly' && <WeeklyView />}
        {currentView === 'daily' && <DailyView />}
        {currentView === 'monthly' && <MonthlyView />}
      </div>
    </div>
  );
};

const CalendarView = () => {
  return (
    <CalendarProvider>
      <CalendarViewContent />
    </CalendarProvider>
  );
};

export default CalendarView;
