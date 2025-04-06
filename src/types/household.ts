
// Household and member related types
export interface UserProfile {
  display_name: string;
  avatar_url?: string;
}

export interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profile?: UserProfile;
}

export interface Household {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
  members?: HouseholdMember[];
}

// Raw data interfaces (for internal use)
export interface RawHouseholdMember {
  id: string;
  household_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}
