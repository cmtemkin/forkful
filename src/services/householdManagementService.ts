// This service is deprecated as the Households feature is coming soon
// Keeping the file to maintain project structure

import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "./householdUtils";

// Delete a household
export const deleteHousehold = async (householdId: string): Promise<boolean> => {
  const userId = await getCurrentUserId();
  
  // Check if user is admin of the household
  const { data: memberData, error: memberError } = await supabase
    .from('household_members')
    .select('role')
    .eq('household_id', householdId)
    .eq('user_id', userId)
    .single();
  
  if (memberError || !memberData) {
    console.error('Error checking user role:', memberError);
    throw new Error('You do not have permission to delete this household');
  }
  
  if (memberData.role !== 'admin') {
    throw new Error('Only household admins can delete households');
  }
  
  // Delete the household
  const { error } = await supabase
    .from('households')
    .delete()
    .eq('id', householdId);
  
  if (error) {
    console.error('Error deleting household:', error);
    throw error;
  }
  
  return true;
};

// Update household name
export const updateHouseholdName = async (householdId: string, name: string): Promise<boolean> => {
  const userId = await getCurrentUserId();
  
  // Check if user is admin of the household
  const { data: memberData, error: memberError } = await supabase
    .from('household_members')
    .select('role')
    .eq('household_id', householdId)
    .eq('user_id', userId)
    .single();
  
  if (memberError || !memberData) {
    console.error('Error checking user role:', memberError);
    throw new Error('You do not have permission to update this household');
  }
  
  if (memberData.role !== 'admin') {
    throw new Error('Only household admins can update household details');
  }
  
  // Update the household name
  const { error } = await supabase
    .from('households')
    .update({ name })
    .eq('id', householdId);
  
  if (error) {
    console.error('Error updating household name:', error);
    throw error;
  }
  
  return true;
};

// Leave a household
export const leaveHousehold = async (householdId: string): Promise<boolean> => {
  const userId = await getCurrentUserId();
  
  // Remove user from the household
  const { error } = await supabase
    .from('household_members')
    .delete()
    .eq('household_id', householdId)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error leaving household:', error);
    throw error;
  }
  
  return true;
};
