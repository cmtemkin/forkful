
import React, { useState } from 'react';
import CalendarCell from '../components/CalendarCell';
import LoadingSpinner from '../components/LoadingSpinner';

// Sample data - in a real app, this would come from an API
const mockCalendarData = {
  days: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
  mealTypes: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
  meals: [
    {
      id: '1',
      title: 'Chicken Alfredo',
      image: 'https://source.unsplash.com/photo-1645112411341-6c4fd023882a',
      day: 'Mon',
      mealType: 'Dinner',
      isLocked: true
    }
  ]
};

const CalendarView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { days, mealTypes, meals } = mockCalendarData;
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  const getMeal = (day: string, mealType: string) => {
    return meals.find(meal => meal.day === day && meal.mealType === mealType);
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b">
        <h1 className="text-2xl font-bold text-center">Calendar</h1>
      </div>
      
      {/* Days header */}
      <div className="grid grid-cols-7">
        {days.map(day => (
          <div key={day} className="text-center py-4 font-medium text-sm">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      {mealTypes.map(mealType => (
        <div key={mealType}>
          {/* Meal type label */}
          <div className="bg-gray-50 py-3 px-4 font-medium text-sm border-y">
            {mealType}
          </div>
          
          {/* Calendar row */}
          <div className="grid grid-cols-7">
            {days.map(day => {
              const meal = getMeal(day, mealType);
              return (
                <CalendarCell
                  key={`${day}-${mealType}`}
                  mealId={meal?.id}
                  title={meal?.title}
                  image={meal?.image}
                  isLocked={meal?.isLocked}
                  day={day}
                  mealType={mealType as any}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarView;
