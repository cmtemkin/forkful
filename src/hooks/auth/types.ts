
import { Session, User } from '@supabase/supabase-js';

export type ProfileData = {
  firstName: string;
  lastName: string;
  displayName: string;
};

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  profileData: ProfileData | null;
  setUserProfileData: (data: ProfileData) => void;
  error: string | null;
  clearError: () => void;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, userData: { firstName: string, lastName: string }) => Promise<{ error: string | null }>;
};
