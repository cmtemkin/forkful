
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

// Mock data for households - in a real app, this would come from a database
const initialHouseholds = [
  { id: '1', name: 'My House', members: 3 },
  { id: '2', name: 'Beach House', members: 2 },
];

const Households = () => {
  const navigate = useNavigate();
  const [households, setHouseholds] = useState(initialHouseholds);
  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleCreateHousehold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHouseholdName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a household name",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new household with a random ID
    const newHousehold = {
      id: Math.random().toString(36).substring(2, 9),
      name: newHouseholdName,
      members: 1
    };
    
    setHouseholds([...households, newHousehold]);
    setNewHouseholdName('');
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Household "${newHouseholdName}" created!`,
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Households</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Household
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Household</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateHousehold} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="householdName">Household Name</Label>
                <Input
                  id="householdName"
                  value={newHouseholdName}
                  onChange={(e) => setNewHouseholdName(e.target.value)}
                  placeholder="Enter household name"
                />
              </div>
              <Button type="submit" className="w-full">Create Household</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {households.map((household) => (
          <Card key={household.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="h-5 w-5 mr-2 text-primary-coral" />
                {household.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>{household.members} {household.members === 1 ? 'member' : 'members'}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => navigate(`/household/${household.id}`)}
              >
                View Household
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Households;
