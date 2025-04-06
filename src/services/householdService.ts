
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
  const { data, error } = await supabase
    .from('households')
    .select(`
      *,
      members:household_members(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching households:', error);
    throw error;
  }

  return data || [];
};

// Create a new household
export const createHousehold = async (name: string): Promise<Household> => {
  const { data, error } = await supabase
    .from('households')
    .insert({
      name
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating household:', error);
    throw error;
  }

  return data;
};

// Get household by ID
export const getHouseholdById = async (id: string): Promise<Household> => {
  const { data, error } = await supabase
    .from('households')
    .select(`
      *,
      members:household_members(
        *,
        profiles:profiles(display_name, avatar_url)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching household:', error);
    throw error;
  }

  return data;
};

// Add member to household
export const addHouseholdMember = async (householdId: string, email: string): Promise<boolean> => {
  // First, find the user by email
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (userError) {
    console.error('Error finding user:', userError);
    throw new Error('User not found with that email');
  }

  // Then add the user to the household
  const { error } = await supabase
    .from('household_members')
    .insert({
      household_id: householdId,
      user_id: userData.id
    });

  if (error) {
    console.error('Error adding member:', error);
    throw error;
  }

  return true;
};
