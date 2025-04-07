
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddMealHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-primary text-white px-4 py-2 flex items-center">
      <button onClick={() => navigate(-1)} className="mr-4">
        <ArrowLeft className="h-6 w-6" />
      </button>
      <h1 className="text-2xl font-bold">Add New Idea</h1>
    </div>
  );
};

export default AddMealHeader;
