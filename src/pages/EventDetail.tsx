
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarClock, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import MealCard from '../components/MealCard';
import { Tab, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock event data - in a real app, this would come from a database
const mockEvents = [
  { 
    id: '1', 
    name: 'Summer BBQ', 
    description: 'Backyard BBQ with friends',
    date: new Date(2025, 6, 15).toISOString(),
    participants: [
      { id: '1', name: 'You', isOwner: true },
      { id: '2', name: 'Alex', isOwner: false },
      { id: '3', name: 'Taylor', isOwner: false },
      { id: '4', name: 'Jordan', isOwner: false },
    ],
    meals: [
      {
        id: '101',
        title: 'Grilled Burgers',
        submittedBy: 'Alex',
        image: 'https://source.unsplash.com/photo-1551615593-ef5fe247e8f7',
        upvotes: 5,
        downvotes: 0,
        date: new Date(2025, 6, 15).toISOString(),
        mealType: 'Dinner',
      },
      {
        id: '102',
        title: 'BBQ Ribs',
        submittedBy: 'You',
        image: 'https://source.unsplash.com/photo-1544025162-d76694265947',
        upvotes: 3,
        downvotes: 1,
        date: new Date(2025, 6, 15).toISOString(),
        mealType: 'Dinner',
      }
    ]
  },
  { 
    id: '2', 
    name: 'Game Night Dinner', 
    description: 'Food for our monthly game night',
    date: new Date(2025, 4, 20).toISOString(),
    participants: [
      { id: '1', name: 'You', isOwner: true },
      { id: '5', name: 'Sam', isOwner: false },
      { id: '6', name: 'Casey', isOwner: false },
    ],
    meals: [
      {
        id: '201',
        title: 'Pizza',
        submittedBy: 'Sam',
        image: 'https://source.unsplash.com/photo-1565299624946-b28f40a0ae38',
        upvotes: 6,
        downvotes: 0,
        date: new Date(2025, 4, 20).toISOString(),
        mealType: 'Dinner',
      }
    ]
  },
];

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newParticipantEmail, setNewParticipantEmail] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ideas');
  
  // Fetch event details
  useEffect(() => {
    // Simulate API call
    const foundEvent = mockEvents.find(e => e.id === id);
    if (foundEvent) {
      setEvent(foundEvent);
    }
    setLoading(false);
  }, [id]);
  
  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipantEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would send an invitation
    toast({
      title: "Invitation Sent",
      description: `Invitation sent to ${newParticipantEmail}`,
    });
    
    // Close dialog and reset form
    setNewParticipantEmail('');
    setIsDialogOpen(false);
  };
  
  const handleAddIdea = () => {
    // Navigate to add meal page with event ID as parameter
    navigate(`/add-meal?eventId=${id}`);
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!event) {
    return <div className="container mx-auto py-8 px-4">Event not found</div>;
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-2 flex items-center">
        <button onClick={() => navigate('/events')} className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">{event.name}</h1>
      </div>
      
      {/* Event details */}
      <div className="px-4 py-4">
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <CalendarClock className="h-5 w-5 mr-2 text-primary-coral" />
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary-coral" />
                <span>{event.participants.length} participants</span>
              </div>
            </div>
            {event.description && (
              <p className="text-gray-600 mt-2">{event.description}</p>
            )}
          </CardContent>
        </Card>
        
        {/* Tabs for Ideas and Participants */}
        <Tabs defaultValue="ideas" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="ideas">Ideas</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ideas" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Food Ideas</h2>
              <Button onClick={handleAddIdea} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Idea
              </Button>
            </div>
            
            {event.meals.length > 0 ? (
              event.meals.map((meal: any) => (
                <MealCard
                  key={meal.id}
                  id={meal.id}
                  title={meal.title}
                  submittedBy={meal.submittedBy}
                  image={meal.image}
                  upvotes={meal.upvotes}
                  downvotes={meal.downvotes}
                  dayMealtime={`${new Date(meal.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${meal.mealType}`}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No food ideas yet</p>
                <Button onClick={handleAddIdea} variant="outline" className="mt-2">
                  Add the first idea
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="participants">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Participants</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Invite
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Participant</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddParticipant} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="participantEmail">Email Address</Label>
                      <Input
                        id="participantEmail"
                        type="email"
                        value={newParticipantEmail}
                        onChange={(e) => setNewParticipantEmail(e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                    <Button type="submit" className="w-full">Send Invitation</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-2">
              {event.participants.map((participant: any) => (
                <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-coral text-white flex items-center justify-center mr-3">
                      {participant.name[0].toUpperCase()}
                    </div>
                    <span>{participant.name}</span>
                  </div>
                  {participant.isOwner && (
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">Owner</span>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EventDetail;
