
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, UserPlus, Home, CalendarDays, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { getHouseholdById, addHouseholdMember, Household, HouseholdMember } from '@/services/householdService';
import LoadingSpinner from '@/components/LoadingSpinner';

const HouseholdDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [household, setHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadHousehold = async () => {
      if (!id) {
        navigate('/households');
        return;
      }
      
      try {
        const householdData = await getHouseholdById(id);
        setHousehold(householdData);
        setMembers(householdData.members || []);
      } catch (error) {
        console.error('Failed to load household details:', error);
        toast({
          title: "Error loading household",
          description: "Could not load household details. Please try again later.",
          variant: "destructive"
        });
        navigate('/households');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHousehold();
  }, [id, navigate, toast]);
  
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !newMemberEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addHouseholdMember(id, newMemberEmail);
      
      // Refresh household members
      const updatedHousehold = await getHouseholdById(id);
      setMembers(updatedHousehold.members || []);
      
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${newMemberEmail}`,
      });
      
      setNewMemberEmail('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to add member:', error);
      
      const errorMsg = error instanceof Error ? error.message : "Please try again later";
      
      toast({
        title: "Error inviting member",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!household) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Household not found</h1>
        <Button onClick={() => navigate('/households')}>
          Back to Households
        </Button>
      </div>
    );
  }
  
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
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Invitation"}
                </Button>
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
              {members.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No members yet</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {members.map(member => (
                    <li key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {member.profile?.display_name
                              ? member.profile.display_name.split(' ').map(n => n[0]).join('')
                              : 'U'}
                          </AvatarFallback>
                          {member.profile?.avatar_url && (
                            <AvatarImage src={member.profile.avatar_url} />
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {member.profile?.display_name || 'User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.role}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
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
