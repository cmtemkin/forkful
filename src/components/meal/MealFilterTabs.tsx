
import React from 'react';

interface MealFilterTabsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const MealFilterTabs = ({ selectedFilter, onFilterChange }: MealFilterTabsProps) => {
  return (
    <div className="px-4 py-2 bg-white border-b border-slate-accent/10">
      <button 
        className={`px-2 py-2 ${selectedFilter === 'By Date' ? 'tab-active' : 'text-slate-accent'}`}
        onClick={() => onFilterChange('By Date')}
      >
        By Date
      </button>
      <button 
        className={`px-2 py-2 ml-4 ${selectedFilter === 'By Votes' ? 'tab-active' : 'text-slate-accent'}`}
        onClick={() => onFilterChange('By Votes')}
      >
        By Votes
      </button>
    </div>
  );
};

export default MealFilterTabs;
