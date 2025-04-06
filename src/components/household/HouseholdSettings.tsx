
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface HouseholdSettingsProps {
  householdName: string;
  onRename: (newName: string) => Promise<void>;
  onLeave: () => Promise<void>;
}

const HouseholdSettings = ({ householdName, onRename, onLeave }: HouseholdSettingsProps) => {
  const [newHouseholdName, setNewHouseholdName] = useState(householdName);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newHouseholdName.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onRename(newHouseholdName);
      setIsRenameDialogOpen(false);
    } catch (error) {
      console.error('Failed to rename household:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeaveHousehold = async () => {
    setIsSubmitting(true);
    
    try {
      await onLeave();
    } catch (error) {
      console.error('Failed to leave household:', error);
    } finally {
      setIsSubmitting(false);
      setIsLeaveDialogOpen(false);
    }
  };

  return (
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
                    {householdName}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename Household</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleRenameSubmit} className="space-y-4">
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
  );
};

export default HouseholdSettings;
