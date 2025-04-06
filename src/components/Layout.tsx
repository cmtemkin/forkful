
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import { Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-chow-background">
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {/* Consistent app header */}
        <header className="bg-white px-4 py-4 text-center border-b">
          <Link to="/">
            <h1 className="font-outfit font-bold text-2xl text-gray-800">Forkful</h1>
          </Link>
        </header>

        <Outlet />
        <div className="h-20" /> {/* Spacer for bottom navigation */}
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Layout;
