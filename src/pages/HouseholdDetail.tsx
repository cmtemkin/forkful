
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, UserPlus, Home, CalendarDays, ShoppingCart, Trash2, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { getHouseholdById } from '@/services/householdService';
import { addHouseholdMember, removeHouseholdMember } from '@/services/householdMembersService';
import { deleteHousehold, updateHouseholdName, leaveHousehold } from '@/services/householdManagementService';
import { Household, HouseholdMember } from '@/types/household';
import LoadingSpinner from '@/components/LoadingSpinner';

const HouseholdDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [household, setHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
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
        setNewHouseholdName(householdData.name);
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
      setIsInviteDialogOpen(false);
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

  const handleRemoveMember = async (memberId: string, userId: string) => {
    if (!id) return;
    
    try {
      await removeHouseholdMember(id, userId);
      
      // Update local state
      setMembers(prev => prev.filter(member => member.id !== memberId));
      
      toast({
        title: "Member removed",
        description: "The member has been removed from the household",
      });
    } catch (error) {
      console.error('Failed to remove member:', error);
      
      toast({
        title: "Error removing member",
        description: "Could not remove the member. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteHousehold = async () => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      await deleteHousehold(id);
      
      toast({
        title: "Household deleted",
        description: "The household has been deleted successfully",
      });
      
      navigate('/households');
    } catch (error) {
      console.error('Failed to delete household:', error);
      
      const errorMsg = error instanceof Error ? error.message : "Please try again later";
      
      toast({
        title: "Error deleting household",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleLeaveHousehold = async () => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      await leaveHousehold(id);
      
      toast({
        title: "Left household",
        description: "You have left the household successfully",
      });
      
      navigate('/households');
    } catch (error) {
      console.error('Failed to leave household:', error);
      
      toast({
        title: "Error leaving household",
        description: "Could not leave the household. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setIsLeaveDialogOpen(false);
    }
  };
  
  const handleRenameHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !newHouseholdName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a household name",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateHouseholdName(id, newHouseholdName);
      
      // Update local state
      if (household) {
        setHousehold({
          ...household,
          name: newHouseholdName
        });
      }
      
      toast({
        title: "Household renamed",
        description: "The household has been renamed successfully",
      });
      
      setIsRenameDialogOpen(false);
    } catch (error) {
      console.error('Failed to rename household:', error);
      
      const errorMsg = error instanceof Error ? error.message : "Please try again later";
      
      toast({
        title: "Error renaming household",
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
  
  // Check if user is admin
  const isAdmin = members.some(member => 
    member.user_id === household.created_by && member.role === 'admin'
  );
  
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
          <div className="flex gap-2">
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
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
            
            {isAdmin && (
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Household</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this household? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteHousehold} disabled={isSubmitting}>
                      {isSubmitting ? "Deleting..." : "Delete Household"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
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
                      {isAdmin && member.user_id !== household.created_by && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveMember(member.id, member.user_id)}
                        >
                          <UserMinus className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
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
                    <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start font-normal">
                          {household.name}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Rename Household</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleRenameHousehold} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="householdNewName">New Household Name</Label>
                            <Input
                              id="householdNewName"
                              value={newHouseholdName}
                              onChange={(e) => setNewHouseholdName(e.target.value)}
                              placeholder="Enter new household name"
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save New Name"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        Leave Household
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Leave Household</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to leave this household? You will lose access to all household data.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleLeaveHousehold} disabled={isSubmitting}>
                          {isSubmitting ? "Leaving..." : "Leave Household"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
