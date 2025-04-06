
import { supabase } from "@/integrations/supabase/client";
import { HouseholdMember, RawHouseholdMember, UserProfile } from "@/types/household";

// Helper function to get household members with profiles
export async function getHouseholdMembers(householdId: string): Promise<HouseholdMember[]> {
  // Get members without profile data
  const { data: rawMembers, error: membersError } = await supabase
    .from('household_members')
    .select(`
      id,
      household_id,
      user_id,
      role,
      joined_at
    `)
    .eq('household_id', householdId);
  
  if (membersError || !rawMembers) {
    console.error(`Error fetching members for household ${householdId}:`, membersError);
    return [];
  }
  
  // For each member, get their profile separately
  const membersWithProfiles = await Promise.all(
    rawMembers.map(async (member: RawHouseholdMember): Promise<HouseholdMember> => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('display_name, avatar_url')
          .eq('id', member.user_id)
          .single();
        
        if (profileError || !profileData) {
          return {
            ...member,
            profile: {
              display_name: 'Unknown User',
              avatar_url: undefined
            }
          };
        }
        
        return {
          ...member,
          profile: {
            display_name: profileData.display_name,
            avatar_url: profileData.avatar_url
          }
        };
      } catch (error) {
        console.warn(`Could not fetch profile for user ${member.user_id}`, error);
        return {
          ...member,
          profile: {
            display_name: 'Unknown User',
            avatar_url: undefined
          }
        };
      }
    })
  );
  
  return membersWithProfiles;
}

// Helper function to check if the user is authenticated
export async function getCurrentUserId(): Promise<string> {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }
  
  return userData.user.id;
}
