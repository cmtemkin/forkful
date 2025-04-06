
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

interface MealTypeSelectorProps {
  value: MealType | string;
  onChange: (value: string) => void;
}

const MealTypeSelector = ({ value, onChange }: MealTypeSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Meal Type</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select meal type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Breakfast">Breakfast</SelectItem>
          <SelectItem value="Lunch">Lunch</SelectItem>
          <SelectItem value="Dinner">Dinner</SelectItem>
          <SelectItem value="Snacks">Snacks</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MealTypeSelector;
