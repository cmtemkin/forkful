
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import { Link } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';

const Layout = () => {
  return (
    <div className="min-h-screen bg-warm-white">
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {/* Consistent app header */}
        <header className="bg-white px-4 py-4 flex items-center justify-between border-b border-slate-accent/20">
          <Link to="/">
            <h1 className="font-outfit font-bold text-2xl text-charcoal-gray">forkful</h1>
          </Link>
          <ProfileMenu />
        </header>

        <Outlet />
        <div className="h-20" /> {/* Spacer for bottom navigation */}
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Layout;
