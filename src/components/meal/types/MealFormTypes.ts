
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';

// Form values interface for form-hook based usage
export interface FormValues {
  title: string;
  ingredients: string;
  instructions?: string;
  sourceUrl?: string;
  sourceDomain?: string;
  image?: string;
  mealType: string;
  day: string;
}

// Props for the form-hook based implementation
export interface FormHookProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  onImageUrlChange: (url: string) => void;
  onImageError: () => void;
}

// Props for direct state management implementation
export interface StateProps {
  editTitle: string;
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;
  editMealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  setEditMealType: React.Dispatch<React.SetStateAction<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>>;
  editDate: Date | undefined;
  setEditDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  editIngredients: string;
  setEditIngredients: React.Dispatch<React.SetStateAction<string>>;
  editInstructions?: string;
  setEditInstructions?: React.Dispatch<React.SetStateAction<string>>;
  editImage: string;
  setEditImage: React.Dispatch<React.SetStateAction<string>>;
}

// Common props for scraped data
export interface ScrapedData {
  title?: string;
  ingredients?: string;
  instructions?: string[];
  imageUrl?: string;
  sourceUrl?: string;
  sourceDomain?: string;
}
