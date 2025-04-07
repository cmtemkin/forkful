
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
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, userData: { firstName: string, lastName: string }) => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  profileData: null,
  setUserProfileData: () => {},
  error: null,
  clearError: () => {},
  signInWithPassword: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
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

  const signInWithPassword = async (email: string, password: string) => {
    try {
      clearError();
      console.log('Attempting to sign in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Signin error:', error);
        setError(error.message);
        return { error: error.message };
      }

      console.log('Signin successful:', data);
      return { error: null };
    } catch (err: any) {
      console.error('Unexpected signin error:', err);
      const errorMessage = err.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string, userData: { firstName: string, lastName: string }) => {
    try {
      clearError();
      console.log('Attempting signup with:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        setError(error.message);
        return { error: error.message };
      }

      console.log('Signup successful:', data);
      
      // Also create or update the profile manually to ensure consistency
      if (data?.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          first_name: userData.firstName,
          last_name: userData.lastName,
          display_name: `${userData.firstName} ${userData.lastName}`
        });
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
          return { error: 'Account created but profile setup failed. Please try logging in.' };
        }
      }
      
      return { error: null };
    } catch (err: any) {
      console.error('Unexpected signup error:', err);
      const errorMessage = err.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      clearError();
      await supabase.auth.signOut();
    } catch (err: any) {
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
    clearError,
    signInWithPassword,
    signUp
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
