
import React from 'react';
import { Button } from '@/components/ui/button';
import DateSelector from '@/components/meal/DateSelector';

interface MealAssignmentToggleProps {
  mode: 'date' | 'event';
  setMode: (mode: 'date' | 'event') => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  selectedEvent: string;
  setSelectedEvent: (eventId: string) => void;
  events: Array<{ id: string; name: string; date: Date }>;
}

const MealAssignmentToggle = ({
  mode,
  setMode,
  date,
  setDate,
  selectedEvent,
  setSelectedEvent,
  events
}: MealAssignmentToggleProps) => {
  return (
    <>
      <div className="flex">
        <Button 
          type="button" 
          variant={mode === 'date' ? 'default' : 'outline'} 
          className="flex-1 rounded-r-none"
          onClick={() => setMode('date')}
        >
          Add to Calendar
        </Button>
        <Button 
          type="button" 
          variant={mode === 'event' ? 'default' : 'outline'} 
          className="flex-1 rounded-l-none"
          onClick={() => setMode('event')}
        >
          Add to Event
        </Button>
      </div>
      
      {/* Date or Event selection based on mode */}
      {mode === 'date' ? (
        <DateSelector 
          date={date} 
          onDateChange={setDate} 
        />
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1">Event</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required={mode === 'event'}
          >
            <option value="">Select an event</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.name} ({event.date.toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};

export default MealAssignmentToggle;
