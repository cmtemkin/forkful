
import { supabase } from "@/integrations/supabase/client";
import { HouseholdMember } from "@/types/household";
import { getHouseholdMembers } from "./householdUtils";

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

// Remove member from household
export const removeHouseholdMember = async (householdId: string, userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('household_members')
    .delete()
    .eq('household_id', householdId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error removing member:', error);
    throw error;
  }

  return true;
};

// Get all members for a household
export const getMembers = async (householdId: string): Promise<HouseholdMember[]> => {
  return await getHouseholdMembers(householdId);
};
