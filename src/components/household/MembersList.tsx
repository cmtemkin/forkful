
import React from 'react';
import { UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HouseholdMember } from '@/types/household';

interface MembersListProps {
  members: HouseholdMember[];
  isAdmin: boolean;
  creatorId: string;
  onRemoveMember: (memberId: string, userId: string) => Promise<void>;
}

const MembersList = ({ members, isAdmin, creatorId, onRemoveMember }: MembersListProps) => {
  if (members.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No members yet</p>
      </div>
    );
  }

  return (
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
          {isAdmin && member.user_id !== creatorId && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onRemoveMember(member.id, member.user_id)}
            >
              <UserMinus className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MembersList;
