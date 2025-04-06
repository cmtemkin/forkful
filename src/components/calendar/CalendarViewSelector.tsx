
import React from 'react';
import { useCalendar, CalendarViewType } from '@/contexts/CalendarContext';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const CalendarViewSelector = () => {
  const { currentView, setCurrentView } = useCalendar();
  
  const handleViewChange = (value: string) => {
    if (value) {
      setCurrentView(value as CalendarViewType);
    }
  };

  return (
    <div className="flex justify-center py-2">
      <ToggleGroup 
        type="single" 
        value={currentView}
        onValueChange={handleViewChange}
        className="bg-gray-100 p-1 rounded-full"
      >
        <ToggleGroupItem 
          value="weekly" 
          className={`px-4 py-1.5 text-sm font-medium rounded-full ${
            currentView === 'weekly' 
              ? 'bg-chow-primary text-white' 
              : 'text-gray-600'
          }`}
        >
          Weekly
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="daily" 
          className={`px-4 py-1.5 text-sm font-medium rounded-full ${
            currentView === 'daily' 
              ? 'bg-chow-primary text-white' 
              : 'text-gray-600'
          }`}
        >
          Daily
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="monthly" 
          className={`px-4 py-1.5 text-sm font-medium rounded-full ${
            currentView === 'monthly' 
              ? 'bg-chow-primary text-white' 
              : 'text-gray-600'
          }`}
        >
          Monthly
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default CalendarViewSelector;
