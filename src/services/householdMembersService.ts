
import { supabase } from "@/integrations/supabase/client";
import { HouseholdMember } from "@/types/household";
import { User } from "@supabase/supabase-js";

// Get all members of a household
export const getHouseholdMembers = async (householdId: string): Promise<HouseholdMember[]> => {
  const { data, error } = await supabase
    .from('household_members')
    .select(`
      id,
      household_id,
      user_id,
      role,
      joined_at,
      profiles (
        id,
        display_name,
        avatar_url
      )
    `)
    .eq('household_id', householdId);

  if (error) {
    console.error('Error fetching household members:', error);
    throw error;
  }

  // Transform the data to match HouseholdMember type
  const members = data.map(member => ({
    id: member.id,
    household_id: member.household_id,
    user_id: member.user_id,
    role: member.role,
    joined_at: member.joined_at,
    profile: {
      display_name: member.profiles?.display_name || 'Unknown User',
      avatar_url: member.profiles?.avatar_url || null
    }
  }));

  return members;
};

// Add a member to a household
export const addHouseholdMember = async (householdId: string, email: string, role: 'admin' | 'member' = 'member'): Promise<void> => {
  // First, find the user by email
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (userError) {
    throw userError;
  }

  if (!userData) {
    throw new Error(`No user found with email ${email}`);
  }

  // Check if user is already a member
  const { data: existingMember, error: memberCheckError } = await supabase
    .from('household_members')
    .select('id')
    .eq('household_id', householdId)
    .eq('user_id', userData.id)
    .maybeSingle();

  if (memberCheckError) {
    throw memberCheckError;
  }

  if (existingMember) {
    throw new Error(`User is already a member of this household`);
  }

  // Add the user to the household
  const { error: addError } = await supabase
    .from('household_members')
    .insert({
      household_id: householdId,
      user_id: userData.id,
      role
    });

  if (addError) {
    throw addError;
  }
};

// Remove a member from a household
export const removeHouseholdMember = async (householdId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('household_members')
    .delete()
    .eq('household_id', householdId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
};

// Update a member's role
export const updateMemberRole = async (householdId: string, userId: string, newRole: 'admin' | 'member'): Promise<void> => {
  const { error } = await supabase
    .from('household_members')
    .update({ role: newRole })
    .eq('household_id', householdId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
};

// Check if the current user is an admin of the household
export const isUserHouseholdAdmin = async (householdId: string, user: User): Promise<boolean> => {
  const { data, error } = await supabase
    .from('household_members')
    .select('role')
    .eq('household_id', householdId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return data.role === 'admin';
};
