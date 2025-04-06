
import { supabase } from "@/integrations/supabase/client";

export interface Household {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
  members?: HouseholdMember[];
}

export interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profile?: {
    display_name: string;
    avatar_url?: string;
  };
}

// Get all households the current user belongs to
export const getUserHouseholds = async (): Promise<Household[]> => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }
  
  const userId = userData.user.id;
  
  // First get all households where user is a member
  const { data: memberHouseholds, error: memberError } = await supabase
    .from('household_members')
    .select('household_id')
    .eq('user_id', userId);
  
  if (memberError) {
    console.error('Error fetching household memberships:', memberError);
    throw memberError;
  }
  
  // Get household IDs where user is a member
  const householdIds = memberHouseholds.map(h => h.household_id);
  
  // Now get all households where user is either the creator or a member
  const { data, error } = await supabase
    .from('households')
    .select(`
      id,
      name,
      created_at,
      created_by
    `)
    .or(`created_by.eq.${userId},id.in.(${householdIds.length > 0 ? householdIds.join(',') : 'null'})`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching households:', error);
    throw error;
  }
  
  // For each household, fetch the members
  const householdsWithMembers = await Promise.all(data.map(async (household) => {
    // First get members without profile data
    const { data: members, error: membersError } = await supabase
      .from('household_members')
      .select(`
        id,
        household_id,
        user_id,
        role,
        joined_at
      `)
      .eq('household_id', household.id);
    
    if (membersError) {
      console.error(`Error fetching members for household ${household.id}:`, membersError);
      return {
        ...household,
        members: []
      };
    }
    
    // Then for each member, get their profile separately
    const membersWithProfiles = await Promise.all(members.map(async (member) => {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', member.user_id)
        .maybeSingle();
      
      if (profileError || !profileData) {
        console.warn(`Could not fetch profile for user ${member.user_id}`, profileError);
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
        profile: profileData
      };
    }));
    
    return {
      ...household,
      members: membersWithProfiles
    };
  }));

  return householdsWithMembers;
};

// Create a new household
export const createHousehold = async (name: string): Promise<Household> => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('households')
    .insert({
      name,
      created_by: userData.user.id
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating household:', error);
    throw error;
  }

  // Add creator as a member with admin role
  await supabase
    .from('household_members')
    .insert({
      household_id: data.id,
      user_id: userData.user.id,
      role: 'admin'
    });

  return data;
};

// Get household by ID
export const getHouseholdById = async (id: string): Promise<Household> => {
  // First get the household
  const { data: household, error } = await supabase
    .from('households')
    .select(`
      id,
      name,
      created_at,
      created_by
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching household:', error);
    throw error;
  }

  // Then get the members without profile data
  const { data: members, error: membersError } = await supabase
    .from('household_members')
    .select(`
      id,
      household_id,
      user_id,
      role,
      joined_at
    `)
    .eq('household_id', id);

  if (membersError) {
    console.error('Error fetching household members:', membersError);
    throw membersError;
  }

  // For each member, get their profile separately
  const membersWithProfiles = await Promise.all(members.map(async (member) => {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', member.user_id)
      .maybeSingle();
    
    if (profileError || !profileData) {
      console.warn(`Could not fetch profile for user ${member.user_id}`, profileError);
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
      profile: profileData
    };
  }));

  return {
    ...household,
    members: membersWithProfiles
  };
};

// Add member to household
export const addHouseholdMember = async (householdId: string, email: string): Promise<boolean> => {
  // First, find the user by email
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (profileError || !profileData) {
    console.error('Error finding user:', profileError);
    throw new Error('User not found with that email');
  }

  // Then add the user to the household
  const { error } = await supabase
    .from('household_members')
    .insert({
      household_id: householdId,
      user_id: profileData.id,
      role: 'member'
    });

  if (error) {
    console.error('Error adding member:', error);
    throw error;
  }

  return true;
};
