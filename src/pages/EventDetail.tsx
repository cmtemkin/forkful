
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Share, 
  Plus,
  ThumbsUp,
  Lock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MealCard from '@/components/calendar/MealCard';

// Mock events data
const mockEvents = [
  {
    id: '1',
    name: 'Summer BBQ',
    date: new Date(2025, 6, 15),
    location: 'Backyard',
    description: 'Annual summer barbecue with friends and family.',
    createdBy: 'Sarah',
    members: ['Sarah', 'John', 'Emma', 'Michael'],
  },
  {
    id: '2',
    name: 'Game Night Dinner',
    date: new Date(2025, 4, 20),
    location: 'Living Room',
    description: 'Dinner and board games with the gang.',
    createdBy: 'John',
    members: ['John', 'Sarah', 'Emma'],
  },
];

// Mock meals data
const mockEventMeals = [
  {
    id: 'meal-1',
    title: 'BBQ Ribs',
    image: 'https://source.unsplash.com/photo-1544025162-d76694265947',
    upvotes: 5,
    eventId: '1',
    submittedBy: 'Sarah',
  },
  {
    id: 'meal-2',
    title: 'Grilled Corn',
    image: 'https://source.unsplash.com/photo-1563379926898-05f4575a45d8',
    upvotes: 3,
    eventId: '1',
    submittedBy: 'John',
  },
  {
    id: 'meal-3',
    title: 'Pasta Salad',
    upvotes: 2,
    eventId: '1',
    submittedBy: 'Emma',
  },
];

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('ideas');
  
  // Find event from mock data
  const event = mockEvents.find(event => event.id === id);
  
  // Get meals associated with this event
  const eventMeals = mockEventMeals.filter(meal => meal.eventId === id);
  
  if (!event) {
    return (
      <div className="p-4">
        <h1>Event not found</h1>
        <Button asChild className="mt-4">
          <Link to="/events">Back to Events</Link>
        </Button>
      </div>
    );
  }
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-primary-coral text-white px-4 py-3 flex items-center">
        <Link to="/events" className="mr-2">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">{event.name}</h1>
      </div>
      
      {/* Event Info Card */}
      <div className="p-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{formatDate(event.date)}</span>
            </div>
            
            {event.location && (
              <div className="flex items-center text-gray-600">
                <span className="ml-7">{event.location}</span>
              </div>
            )}
            
            {event.description && (
              <p className="text-gray-700 mt-2">{event.description}</p>
            )}
            
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2" />
              <span>{event.members.length} members</span>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button className="flex-1" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Members
              </Button>
              <Button className="flex-1" variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <div className="px-4">
        <Tabs 
          defaultValue="ideas" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ideas">Meal Ideas</TabsTrigger>
            <TabsTrigger value="plan">Meal Plan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ideas" className="mt-4 space-y-4">
            {/* Add Meal Button */}
            <Link 
              to={`/add-meal?eventId=${id}`}
              className="flex items-center justify-center w-full p-3 bg-primary-coral text-white rounded-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Meal Idea
            </Link>
            
            {/* Meal Ideas */}
            {eventMeals.length > 0 ? (
              eventMeals.map(meal => (
                <div key={meal.id} className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{meal.title}</h3>
                      <p className="text-sm text-gray-500">Added by {meal.submittedBy}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 text-pistachio-green mr-1" />
                        <span className="text-sm">{meal.upvotes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No meal ideas yet.</p>
                <p>Add the first idea for this event!</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="plan" className="mt-4">
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-medium mb-2">Final Menu</h3>
                {eventMeals.length > 0 ? (
                  <div className="space-y-2">
                    {eventMeals
                      .filter(meal => meal.upvotes > 2) // Just a simple filter for demonstration
                      .map(meal => (
                        <div key={meal.id} className="flex items-center justify-between">
                          <span>{meal.title}</span>
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <p className="text-gray-500">No meals finalized yet.</p>
                )}
              </div>
              
              <Button className="w-full">
                Generate Grocery List
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EventDetail;
