
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getUserHouseholds, createHousehold, Household } from '@/services/householdService';
import LoadingSpinner from '@/components/LoadingSpinner';

const Households = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadHouseholds = async () => {
      if (!user) return;
      
      try {
        const householdData = await getUserHouseholds();
        setHouseholds(householdData);
      } catch (error) {
        console.error('Failed to load households:', error);
        toast({
          title: "Error loading households",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHouseholds();
  }, [user, toast]);
  
  const handleCreateHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newHouseholdName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a household name",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newHousehold = await createHousehold(newHouseholdName);
      setHouseholds(prev => [newHousehold, ...prev]);
      setNewHouseholdName('');
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: `Household "${newHouseholdName}" created!`,
      });
    } catch (error) {
      console.error('Failed to create household:', error);
      toast({
        title: "Error creating household",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
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
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Household"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {households.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No households yet</h2>
          <p className="text-gray-600 mb-6">Create your first household to get started</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Household
          </Button>
        </div>
      ) : (
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
                  <span>
                    {household.members?.length || 1} 
                    {(household.members?.length || 1) === 1 ? ' member' : ' members'}
                  </span>
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
      )}
    </div>
  );
};

export default Households;
