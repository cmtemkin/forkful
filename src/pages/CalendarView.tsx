
import React, { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      {/* Header */}
      <div className="bg-white flex items-center px-4 py-4 shadow-sm">
        <Link to="/" className="text-chow-primary">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold mx-auto pr-6">ChowDown</h1>
      </div>
      
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
