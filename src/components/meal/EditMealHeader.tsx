
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Save } from 'lucide-react';

interface EditMealHeaderProps {
  id: string;
  isLoading: boolean;
  onSave: () => void;
}

const EditMealHeader = ({ id, isLoading, onSave }: EditMealHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-30 flex items-center justify-between px-4 py-3 border-b">
      <button onClick={() => navigate(`/meal/${id}`)} className="flex items-center">
        <X className="h-6 w-6" />
      </button>
      <h1 className="text-xl font-bold">Edit Meal</h1>
      <button 
        onClick={onSave}
        disabled={isLoading}
        className="text-primary-coral hover:text-primary-coral/80 transition-colors"
      >
        <Save className="h-6 w-6 text-primary-coral" strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default EditMealHeader;
