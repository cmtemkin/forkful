
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import DateSelector from '@/components/meal/DateSelector';

// Mock data for events - in a real app, this would come from a database
const initialEvents = [
  { 
    id: '1', 
    name: 'Summer BBQ', 
    description: 'Backyard BBQ with friends',
    date: new Date(2025, 6, 15),
    participants: 4
  },
  { 
    id: '2', 
    name: 'Game Night Dinner', 
    description: 'Food for our monthly game night',
    date: new Date(2025, 4, 20),
    participants: 6
  },
];

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState(initialEvents);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [eventDate, setEventDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event name",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new event with a random ID
    const newEvent = {
      id: Math.random().toString(36).substring(2, 9),
      name: newEventName,
      description: newEventDescription,
      date: eventDate || new Date(),
      participants: 1
    };
    
    setEvents([...events, newEvent]);
    setNewEventName('');
    setNewEventDescription('');
    setEventDate(new Date());
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Event "${newEventName}" created!`,
    });
  };

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return (
    <div className="container mx-auto py-8 px-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Events</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  placeholder="Enter event name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventDescription">Description (Optional)</Label>
                <Textarea
                  id="eventDescription"
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  placeholder="What's this event about?"
                  className="min-h-[80px]"
                />
              </div>
              
              <DateSelector
                date={eventDate}
                onDateChange={setEventDate}
              />
              
              <Button type="submit" className="w-full">Create Event</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarClock className="h-5 w-5 mr-2 text-primary-coral" />
                {event.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
              <div className="flex items-center text-gray-600 justify-between">
                <div className="text-sm font-medium">
                  {event.date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{event.participants} {event.participants === 1 ? 'participant' : 'participants'}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => navigate(`/event/${event.id}`)}
              >
                View Event
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Events;
