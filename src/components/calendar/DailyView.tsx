
import React from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronRight, ChevronLeft, Plus } from 'lucide-react';
import { useCalendar } from '@/contexts/CalendarContext';
import { Link } from 'react-router-dom';

const DailyView = () => {
  const { currentDate, setCurrentDate, mealTypes, getMealsByType } = useCalendar();
  
  const formattedDate = format(currentDate, 'MMMM d');
  
  const goToPreviousDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };
  
  const goToNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };
  
  return (
    <div className="flex flex-col w-full pb-20">
      <div className="bg-white px-4 py-6 border-b">
        <div className="flex items-center justify-between">
          <button onClick={goToPreviousDay} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-center">{formattedDate}</h1>
          <button onClick={goToNextDay} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {mealTypes.map((mealType) => {
          const mealsForType = getMealsByType(currentDate, mealType);
          
          return (
            <div key={mealType} className="space-y-2">
              <h2 className="text-xl font-bold">{mealType}</h2>
              
              {mealsForType.length > 0 ? (
                <div className="space-y-3">
                  {mealsForType.map((meal) => (
                    <Link 
                      key={meal.id} 
                      to={`/meal/${meal.id}`}
                      className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-gray-200 rounded-lg overflow-hidden">
                          {meal.image ? (
                            <img 
                              src={meal.image} 
                              alt={meal.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <span className="text-xs text-gray-500">No img</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{meal.title}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-chow-upvote text-sm">{meal.upvotes || 0} 👍</span>
                            {meal.isLocked && (
                              <span className="text-gray-500 text-xs">• Locked</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 flex flex-col items-center">
                  <p className="text-gray-500 mb-4">No meals yet for {mealType}</p>
                  <Link
                    to={`/add-meal?mealType=${mealType}&day=${format(currentDate, 'EEEE')}`}
                    className="bg-chow-primary text-white py-2 px-4 rounded-full flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Idea for {mealType}
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <Link
        to="/add-meal"
        className="fixed bottom-24 right-6 bg-chow-primary text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default DailyView;
