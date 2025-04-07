
import React from 'react';

interface MealCardTitleProps {
  title: string;
  submittedBy?: string;
}

const MealCardTitle = ({ title, submittedBy }: MealCardTitleProps) => {
  return (
    <div className="mb-2 pr-16">
      <h3 className="text-xl font-bold text-charcoal-gray leading-tight line-clamp-1">{title}</h3>
      {submittedBy && <p className="text-sm text-slate-accent mt-0.5">{submittedBy}</p>}
    </div>
  );
};

export default MealCardTitle;
