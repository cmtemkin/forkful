
import React from 'react';
import { format, isToday, isSameDay } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { useCalendar, MealType } from '@/contexts/CalendarContext';
import MealCard from './MealCard';
import { Link } from 'react-router-dom';

const WeeklyView = () => {
  const { 
    currentDate, 
    setCurrentDate, 
    mealTypes, 
    getWeekDays, 
    getMealsByType 
  } = useCalendar();
  
  const weekDays = getWeekDays();

  const handleDaySelect = (date: Date) => {
    setCurrentDate(date);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Day selector */}
      <div className="flex overflow-x-auto py-2 px-1 bg-white sticky top-0 z-10 border-b">
        {weekDays.map((day) => {
          const dayNumber = format(day, 'd');
          const dayName = format(day, 'EEE');
          const isSelected = isSameDay(day, currentDate);
          const isCurrentDay = isToday(day);
          const hasMeals = mealTypes.some(type => getMealsByType(day, type as MealType).length > 0);
          
          return (
            <button
              key={day.toString()}
              className={`flex flex-col items-center min-w-[3.5rem] mx-1 rounded-full py-2 px-3 ${
                isSelected 
                  ? 'bg-chow-primary text-white' 
                  : isCurrentDay 
                    ? 'bg-gray-100' 
                    : 'bg-white'
              }`}
              onClick={() => handleDaySelect(day)}
            >
              <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                {dayName}
              </span>
              <span className={`text-lg font-bold ${isSelected ? 'text-white' : ''}`}>
                {dayNumber}
              </span>
              {hasMeals && !isSelected && (
                <div className="h-1 w-1 bg-chow-primary rounded-full mt-1"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Meal sections */}
      <div className="p-4 space-y-6">
        {mealTypes.map((mealType) => {
          const mealsForType = getMealsByType(currentDate, mealType);
          const topMeal = mealsForType.length > 0 
            ? mealsForType.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))[0] 
            : null;
          
          return (
            <div key={mealType} className="space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{mealType}</h2>
                {topMeal?.isLocked && (
                  <div className="bg-gray-100 text-gray-500 text-xs py-1 px-2 rounded-full">
                    Locked
                  </div>
                )}
              </div>
              
              {topMeal ? (
                <MealCard 
                  id={topMeal.id}
                  title={topMeal.title}
                  image={topMeal.image}
                  upvotes={topMeal.upvotes || 0}
                  isLocked={topMeal.isLocked}
                />
              ) : (
                <Link
                  to={`/add-meal?mealType=${mealType}&day=${format(currentDate, 'EEEE')}`}
                  className="flex items-center justify-center h-24 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-lg">+ Add Meal</span>
                    <span className="text-sm">No meals yet for {mealType}</span>
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyView;
