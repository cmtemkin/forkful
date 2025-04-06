
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getHouseholdById } from '@/services/householdService';
import { addHouseholdMember, removeHouseholdMember } from '@/services/householdMembersService';
import { deleteHousehold, updateHouseholdName, leaveHousehold } from '@/services/householdManagementService';
import { Household, HouseholdMember } from '@/types/household';
import LoadingSpinner from '@/components/LoadingSpinner';

// Import components
import HouseholdHeader from '@/components/household/HouseholdHeader';
import MembersList from '@/components/household/MembersList';
import MealPlanningCards from '@/components/household/MealPlanningCards';
import HouseholdSettings from '@/components/household/HouseholdSettings';

const HouseholdDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [household, setHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  const handleAddMember = async (email: string) => {
    if (!id || !email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await addHouseholdMember(id, email);
      
      // Refresh household members
      const updatedHousehold = await getHouseholdById(id);
      setMembers(updatedHousehold.members || []);
      
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      });
    } catch (error) {
      console.error('Failed to add member:', error);
      
      const errorMsg = error instanceof Error ? error.message : "Please try again later";
      
      toast({
        title: "Error inviting member",
        description: errorMsg,
        variant: "destructive"
      });
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
    }
  };
  
  const handleLeaveHousehold = async () => {
    if (!id) return;
    
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
    }
  };
  
  const handleRenameHousehold = async (newName: string) => {
    if (!id || !newName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a household name",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await updateHouseholdName(id, newName);
      
      // Update local state
      if (household) {
        setHousehold({
          ...household,
          name: newName
        });
      }
      
      toast({
        title: "Household renamed",
        description: "The household has been renamed successfully",
      });
    } catch (error) {
      console.error('Failed to rename household:', error);
      
      const errorMsg = error instanceof Error ? error.message : "Please try again later";
      
      toast({
        title: "Error renaming household",
        description: errorMsg,
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!household) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Household not found</h1>
        <button onClick={() => navigate('/households')}>
          Back to Households
        </button>
      </div>
    );
  }
  
  // Check if user is admin
  const isAdmin = members.some(member => 
    member.user_id === household.created_by && member.role === 'admin'
  );
  
  return (
    <div className="container mx-auto py-8 px-4">
      <HouseholdHeader 
        name={household.name}
        isAdmin={isAdmin}
        onInviteMember={handleAddMember}
        onDeleteHousehold={handleDeleteHousehold}
      />
      
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
              <MembersList 
                members={members}
                isAdmin={isAdmin}
                creatorId={household.created_by}
                onRemoveMember={handleRemoveMember}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="meals">
          <MealPlanningCards />
        </TabsContent>
        
        <TabsContent value="settings">
          <HouseholdSettings 
            householdName={household.name}
            onRename={handleRenameHousehold}
            onLeave={handleLeaveHousehold}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HouseholdDetail;
