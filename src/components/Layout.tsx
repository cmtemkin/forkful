
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const Layout = () => {
  return (
    <div className="min-h-screen bg-chow-background">
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        <Outlet />
        <div className="h-20" /> {/* Spacer for bottom navigation */}
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Layout;
