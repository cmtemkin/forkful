
// This service is deprecated as the Households feature is coming soon
// All functionality has been disabled to avoid interference with the rest of the app

import { supabase } from "@/integrations/supabase/client";
import { HouseholdMember } from "@/types/household";

// Helper function to get household members with profiles (stub)
export async function getHouseholdMembers(): Promise<HouseholdMember[]> {
  return [];
}

// Helper function to check if the user is authenticated
export async function getCurrentUserId(): Promise<string> {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }
  
  return userData.user.id;
}
