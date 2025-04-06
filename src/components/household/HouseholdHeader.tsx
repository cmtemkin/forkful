
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InviteMemberDialog from './InviteMemberDialog';
import DeleteHouseholdDialog from './DeleteHouseholdDialog';

interface HouseholdHeaderProps {
  name: string;
  isAdmin: boolean;
  onInviteMember: (email: string) => Promise<void>;
  onDeleteHousehold: () => Promise<void>;
}

const HouseholdHeader = ({ name, isAdmin, onInviteMember, onDeleteHousehold }: HouseholdHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8">
      <Button variant="ghost" onClick={() => navigate('/households')} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Households
      </Button>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Home className="h-6 w-6 mr-2 text-primary-coral" />
          <h1 className="text-2xl font-bold">{name}</h1>
        </div>
        <div className="flex gap-2">
          <InviteMemberDialog onInvite={onInviteMember} />
          {isAdmin && <DeleteHouseholdDialog onDelete={onDeleteHousehold} />}
        </div>
      </div>
    </div>
  );
};

export default HouseholdHeader;
