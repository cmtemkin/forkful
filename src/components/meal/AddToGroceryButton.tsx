
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddToGroceryButtonProps {
  onClick: () => void;
}

const AddToGroceryButton = ({ onClick }: AddToGroceryButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      className="w-full bg-green-600 hover:bg-green-700 text-white"
    >
      <Plus className="h-5 w-5 mr-2" />
      Add to Grocery List
    </Button>
  );
};

export default AddToGroceryButton;
