
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, ShoppingCart, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MealPlanningCards = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarDays className="h-5 w-5 mr-2 text-primary-coral" />
            Meal Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600">
          View and plan meals for your household
        </CardContent>
        <div className="px-6 pb-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/calendar')}
          >
            View Calendar
          </Button>
        </div>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-primary-coral" />
            Grocery List
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600">
          Manage your household's shopping list
        </CardContent>
        <div className="px-6 pb-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/grocery-list')}
          >
            View Grocery List
          </Button>
        </div>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2 text-primary-coral" />
            Add New Meal
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600">
          Add a new meal to your household collection
        </CardContent>
        <div className="px-6 pb-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/add-meal')}
          >
            Add Meal
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MealPlanningCards;
