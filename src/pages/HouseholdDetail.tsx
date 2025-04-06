
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, UserPlus, Home, CalendarDays, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

// Mock data for household details - in a real app, this would come from a database
const householdsData = {
  '1': {
    id: '1',
    name: 'My House',
    members: [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
    ]
  },
  '2': {
    id: '2',
    name: 'Beach House',
    members: [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com' },
    ]
  }
};

const HouseholdDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch household data - in a real app, this would be an API call
  const household = householdsData[id as keyof typeof householdsData];
  
  // Redirect to households if not found
  if (!household) {
    navigate('/households');
    return null;
  }
  
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would send an invitation to the email
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${newMemberEmail}`,
    });
    
    setNewMemberEmail('');
    setIsDialogOpen(false);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/households')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Households
        </Button>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Home className="h-6 w-6 mr-2 text-primary-coral" />
            <h1 className="text-2xl font-bold">{household.name}</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite a Member</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="memberEmail">Email Address</Label>
                  <Input
                    id="memberEmail"
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <Button type="submit" className="w-full">Send Invitation</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="meals">Meal Planning</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Household Members</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {household.members.map(member => (
                  <li key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="meals">
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
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Household Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="householdName">Household Name</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      id="householdName" 
                      defaultValue={household.name} 
                    />
                    <Button variant="outline">Save</Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Button variant="destructive">
                    Leave Household
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HouseholdDetail;
