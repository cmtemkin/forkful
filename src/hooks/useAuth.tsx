
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type ProfileData = {
  firstName: string;
  lastName: string;
  displayName: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  profileData: ProfileData | null;
  setUserProfileData: (data: ProfileData) => void;
  error: string | null;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  profileData: null,
  setUserProfileData: () => {},
  error: null,
  clearError: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state change event:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        // Fetch profile data when user logs in
        if (currentSession?.user && event === 'SIGNED_IN') {
          // Use setTimeout to prevent potential lockups with Supabase auth
          setTimeout(() => {
            fetchProfileData(currentSession.user.id);
          }, 0);
        }
        
        // Clear profile data on sign out
        if (event === 'SIGNED_OUT') {
          setProfileData(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Got existing session:', currentSession ? 'yes' : 'no');
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Fetch profile data if user exists
      if (currentSession?.user) {
        fetchProfileData(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchProfileData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, display_name')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile data:', error);
        return;
      }
      
      if (data) {
        setProfileData({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          displayName: data.display_name || ''
        });
      }
    } catch (error) {
      console.error('Error in profile data fetch:', error);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out. Please try again.');
    }
  };
  
  const setUserProfileData = (data: ProfileData) => {
    setProfileData(data);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    profileData,
    setUserProfileData,
    error,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
