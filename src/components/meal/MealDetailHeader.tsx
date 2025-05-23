
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

interface MealDetailHeaderProps {
  title: string;
  id: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  handleDelete: () => void;
  handleSaveEdits: () => void;
}

const MealDetailHeader = ({
  title,
  id,
  isEditing,
  setIsEditing,
  showDeleteDialog,
  setShowDeleteDialog,
  handleDelete,
  handleSaveEdits
}: MealDetailHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
      <button onClick={() => navigate(-1)} className="mr-2">
        <ArrowLeft className="h-6 w-6" />
      </button>
      <h1 className="text-xl font-bold flex-1 text-center">{isEditing ? "Edit Meal" : title}</h1>
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <Button variant="ghost" className="text-white hover:bg-primary-dark" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleSaveEdits} className="border-white hover:bg-primary-dark text-zinc-950">
              Save
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" className="text-white hover:bg-primary-dark" onClick={() => setIsEditing(true)}>
              <Edit className="h-5 w-5" />
            </Button>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-primary-dark">
                  <Trash className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete this meal?</DialogTitle>
                  <DialogDescription>
                    This will remove this meal from your calendar. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-between gap-3 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeleteDialog(false)}
                    className="bg-slate-100 text-charcoal-gray hover:bg-slate-200 border-slate-200 w-full"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleDelete} 
                    className="bg-primary-coral text-white hover:bg-primary-coral/90 w-full"
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

export default MealDetailHeader;
