
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

// Types
export interface Meal {
  id: string;
  title: string;
  image?: string;
  day: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  ingredients: string[];
  instructions?: string[];
  isPicked?: boolean;
  pickedByUserId?: string;
  pickedAt?: string;
  upvotes: number;
  downvotes: number;
  submittedBy?: string;
  dateAdded?: string;
}

// Helper to notify other components about meal updates
export const notifyMealUpdate = () => {
  window.dispatchEvent(new Event('forkful-meals-updated'));
};

// Parse a day string to a Date object
export const parseDayToDate = (day: string): Date => {
  const today = new Date();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayIndex = daysOfWeek.indexOf(day);
  
  if (dayIndex >= 0) {
    const currentDayIndex = today.getDay();
    const diff = dayIndex - currentDayIndex;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    return targetDate;
  }
  
  return today;
};

// Get meals from localStorage or return empty array
export const getMealsFromStorage = (): Meal[] => {
  try {
    const storedMeals = localStorage.getItem('forkful_meals');
    return storedMeals ? JSON.parse(storedMeals) : [];
  } catch (err) {
    console.error('Error loading meals from storage:', err);
    return [];
  }
};

// Save meals to localStorage
export const saveMealsToStorage = (meals: Meal[]): void => {
  try {
    localStorage.setItem('forkful_meals', JSON.stringify(meals));
    notifyMealUpdate();
  } catch (err) {
    console.error('Error saving meals to storage:', err);
  }
};

// Find a specific meal by ID
export const findMealById = (id: string | undefined): Meal | null => {
  if (!id) return null;
  
  try {
    const meals = getMealsFromStorage();
    return meals.find(m => m.id === id) || null;
  } catch (err) {
    console.error('Error finding meal by ID:', err);
    return null;
  }
};
