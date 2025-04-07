
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { format, startOfWeek, addDays, addWeeks, isSameDay, isToday } from 'date-fns';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
export type DayString = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
export type CalendarViewType = 'weekly' | 'daily' | 'monthly';

export interface Meal {
  id: string;
  title: string;
  image?: string;
  day: DayString;
  mealType: MealType;
  isPicked?: boolean;
  pickedByUserId?: string;
  pickedAt?: string;
  upvotes?: number;
  downvotes?: number;
}

interface CalendarContextType {
  currentDate: Date;
  currentView: CalendarViewType;
  currentWeekStart: Date;
  mealTypes: MealType[];
  meals: Meal[];
  setCurrentDate: (date: Date) => void;
  setCurrentView: (view: CalendarViewType) => void;
  nextWeek: () => void;
  prevWeek: () => void;
  getWeekDays: () => Date[];
  getMealsForDay: (date: Date) => Meal[];
  getMealsByType: (date: Date, mealType: MealType) => Meal[];
  dayToString: (date: Date) => DayString;
  toggleMealPicked: (mealId: string) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<CalendarViewType>('weekly');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  
  // Get meals from localStorage instead of using the mock data
  const [meals, setMeals] = useState<Meal[]>([]);
  
  // Load meals from localStorage
  useEffect(() => {
    const storedMeals = localStorage.getItem('forkful_meals');
    if (storedMeals) {
      try {
        const parsedMeals = JSON.parse(storedMeals) as Meal[];
        setMeals(parsedMeals);
      } catch (err) {
        console.error('Error parsing meals from localStorage', err);
      }
    }
  }, []);
  
  // Add a listener to update meals whenever localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedMeals = localStorage.getItem('forkful_meals');
      if (storedMeals) {
        try {
          const parsedMeals = JSON.parse(storedMeals) as Meal[];
          setMeals(parsedMeals);
        } catch (err) {
          console.error('Error parsing meals from localStorage', err);
        }
      }
    };

    // Use a custom event to trigger updates
    window.addEventListener('forkful-meals-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('forkful-meals-updated', handleStorageChange);
    };
  }, []);
  
  const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const days: DayString[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const nextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };
  
  const prevWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, -1));
  };
  
  const getWeekDays = (): Date[] => {
    // Generate a full 7-day week starting from Sunday
    return Array.from({ length: 7 }).map((_, i) => 
      addDays(currentWeekStart, i)
    );
  };
  
  const dayToString = (date: Date): DayString => {
    const dayIndex = date.getDay(); // Sunday is already 0
    return days[dayIndex];
  };
  
  const getMealsForDay = (date: Date): Meal[] => {
    const dayStr = dayToString(date);
    // Only return meals that are picked
    return meals.filter(meal => meal.day === dayStr && meal.isPicked);
  };
  
  const getMealsByType = (date: Date, mealType: MealType): Meal[] => {
    const dayStr = dayToString(date);
    // Only return meals that are picked
    return meals.filter(
      meal => meal.day === dayStr && meal.mealType === mealType && meal.isPicked
    );
  };
  
  // Add a new function to toggle the picked status of a meal
  const toggleMealPicked = (mealId: string) => {
    const storedMeals = localStorage.getItem('forkful_meals');
    if (storedMeals) {
      try {
        const allMeals = JSON.parse(storedMeals) as Meal[];
        const updatedMeals = allMeals.map(meal => {
          if (meal.id === mealId) {
            return {
              ...meal,
              isPicked: !meal.isPicked,
              pickedByUserId: !meal.isPicked ? 'current-user' : undefined,
              pickedAt: !meal.isPicked ? new Date().toISOString() : undefined
            };
          }
          return meal;
        });
        
        localStorage.setItem('forkful_meals', JSON.stringify(updatedMeals));
        setMeals(updatedMeals);
        window.dispatchEvent(new Event('forkful-meals-updated'));
      } catch (err) {
        console.error('Error toggling meal picked status', err);
      }
    }
  };
  
  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        currentView,
        currentWeekStart,
        mealTypes,
        meals,
        setCurrentDate,
        setCurrentView,
        nextWeek,
        prevWeek,
        getWeekDays,
        getMealsForDay,
        getMealsByType,
        dayToString,
        toggleMealPicked
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
