
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Utensils, Calendar, Plus, ShoppingBasket } from 'lucide-react';

const BottomNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-4 max-w-lg mx-auto">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `bottom-nav-item py-4 ${isActive ? 'text-chow-primary' : 'text-gray-500'}`
          }
          end
        >
          <Utensils className="bottom-nav-icon" />
          <span>Ideas</span>
        </NavLink>
        <NavLink 
          to="/calendar" 
          className={({ isActive }) => 
            `bottom-nav-item py-4 ${isActive ? 'text-chow-primary' : 'text-gray-500'}`
          }
        >
          <Calendar className="bottom-nav-icon" />
          <span>Calendar</span>
        </NavLink>
        <NavLink 
          to="/add-meal" 
          className={({ isActive }) => 
            `bottom-nav-item py-2 ${isActive ? 'text-white' : 'text-white'}`
          }
        >
          <div className="bg-primary-coral rounded-full w-12 h-12 flex items-center justify-center shadow-md">
            <Plus className="bottom-nav-icon" />
          </div>
          <span className="text-gray-500 mt-1">Add</span>
        </NavLink>
        <NavLink 
          to="/grocery-list" 
          className={({ isActive }) => 
            `bottom-nav-item py-4 ${isActive ? 'text-chow-primary' : 'text-gray-500'}`
          }
        >
          <ShoppingBasket className="bottom-nav-icon" />
          <span>Groceries</span>
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNavigation;
