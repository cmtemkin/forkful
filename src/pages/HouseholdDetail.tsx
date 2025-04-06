
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

const HouseholdDetail = () => {
  const navigate = useNavigate();
  
  // Immediately redirect to the households page with the Coming Soon message
  React.useEffect(() => {
    navigate('/households');
  }, [navigate]);
  
  // Show a simple coming soon view as a fallback if redirection fails
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-lg mx-auto py-12">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Construction className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600">
            We're working on an exciting new Households feature that will allow you to 
            share meal plans with family and friends.
          </p>
          <p className="text-gray-600 mt-4">
            Check back soon!
          </p>
          <button 
            onClick={() => navigate('/households')}
            className="mt-6 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Households
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HouseholdDetail;
