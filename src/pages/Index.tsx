
import React from 'react';
import { Navigate } from 'react-router-dom';
import Logo from '../components/Logo';

const Index = () => {
  // In a real app, you might check authentication status here
  // For now, we'll just redirect to the voting feed
  return <Navigate to="/" replace />;
};

export default Index;
