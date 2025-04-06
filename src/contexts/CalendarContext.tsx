
import { createContext, useContext, useState, ReactNode } from 'react';
import { format, startOfWeek, addDays, addWeeks, isSameDay, isToday } from 'date-fns';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
export type DayString = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type CalendarViewType = 'weekly' | 'daily' | 'monthly';

export interface Meal {
  id: string;
  title: string;
  image?: string;
  day: DayString;
  mealType: MealType;
  isLocked?: boolean;
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
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

// Sample data - in a real app, this would come from an API
const mockMeals: Meal[] = [
  {
    id: '1',
    title: 'Chicken Alfredo',
    image: 'https://source.unsplash.com/photo-1645112411341-6c4fd023882a',
    day: 'Mon',
    mealType: 'Dinner',
    isLocked: true,
    upvotes: 5,
    downvotes: 2
  },
  {
    id: '2',
    title: 'Chicken Salad',
    image: 'https://source.unsplash.com/photo-1546069901-ba9599a7e63c',
    day: 'Tue',
    mealType: 'Breakfast',
    upvotes: 5,
    downvotes: 0
  },
  {
    id: '3',
    title: 'Pancakes',
    image: 'https://source.unsplash.com/photo-1567620905732-2d1ec7ab7445',
    day: 'Wed',
    mealType: 'Breakfast',
    upvotes: 1,
    downvotes: 0
  },
  {
    id: '4',
    title: 'Tacos',
    image: 'https://source.unsplash.com/photo-1565299624946-b28f40a0ae38',
    day: 'Wed',
    mealType: 'Lunch',
    upvotes: 3,
    downvotes: 1
  },
  {
    id: '5',
    title: 'Spaghetti',
    image: 'https://source.unsplash.com/photo-1551183053-bf91a1d81141',
    day: 'Thu',
    mealType: 'Dinner',
    upvotes: 8,
    downvotes: 1
  },
  {
    id: '6',
    title: 'Apple',
    image: 'https://source.unsplash.com/photo-1568702846914-96b305d2aaeb',
    day: 'Fri',
    mealType: 'Snacks',
    upvotes: 4,
    downvotes: 0
  }
];

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<CalendarViewType>('weekly');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  
  const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const days: DayString[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const nextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };
  
  const prevWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, -1));
  };
  
  const getWeekDays = (): Date[] => {
    return Array.from({ length: 7 }).map((_, i) => 
      addDays(currentWeekStart, i)
    );
  };
  
  const dayToString = (date: Date): DayString => {
    const dayIndex = (date.getDay() + 6) % 7; // Convert Sunday (0) to last day
    return days[dayIndex];
  };
  
  const getMealsForDay = (date: Date): Meal[] => {
    const dayStr = dayToString(date);
    return mockMeals.filter(meal => meal.day === dayStr);
  };
  
  const getMealsByType = (date: Date, mealType: MealType): Meal[] => {
    const dayStr = dayToString(date);
    return mockMeals.filter(
      meal => meal.day === dayStr && meal.mealType === mealType
    );
  };
  
  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        currentView,
        currentWeekStart,
        mealTypes,
        meals: mockMeals,
        setCurrentDate,
        setCurrentView,
        nextWeek,
        prevWeek,
        getWeekDays,
        getMealsForDay,
        getMealsByType,
        dayToString
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
