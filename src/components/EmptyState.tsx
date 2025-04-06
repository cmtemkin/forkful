
import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLink: string;
  actionText: string;
}

const EmptyState = ({ title, description, actionLink, actionText }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-chow-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
        <Plus className="h-8 w-8 text-chow-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-xs">{description}</p>
      <Link 
        to={actionLink}
        className="bg-chow-primary text-white px-6 py-3 rounded-full font-medium"
      >
        {actionText}
      </Link>
    </div>
  );
};

export default EmptyState;
