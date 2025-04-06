import { supabase } from "@/integrations/supabase/client";
import { Household } from "@/types/household";
import { getCurrentUserId, getHouseholdMembers } from "./householdUtils";

// Get all households the current user belongs to
export const getUserHouseholds = async (): Promise<Household[]> => {
  const userId = await getCurrentUserId();
  
  // Get all household IDs where user is a member
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
  
  // Fetch households data
  const { data: households, error } = await supabase
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
  const householdsWithMembers = await Promise.all(
    households.map(async (household) => {
      const members = await getHouseholdMembers(household.id);
      return {
        ...household,
        members
      };
    })
  );

  return householdsWithMembers;
};

// Create a new household
export const createHousehold = async (name: string): Promise<Household> => {
  const userId = await getCurrentUserId();
  
  const { data, error } = await supabase
    .from('households')
    .insert({
      name,
      created_by: userId
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
      user_id: userId,
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

  // Get members with their profiles
  const members = await getHouseholdMembers(id);

  return {
    ...household,
    members
  };
};
