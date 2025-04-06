
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

const Households = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Households</h1>
      
      <Card className="w-full max-w-lg mx-auto py-12">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Construction className="h-16 w-16 text-primary-coral" />
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Households;
