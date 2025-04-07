
import { createContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData, AuthContextType } from './types';
import { fetchProfileData, signInWithPassword, signUp, signOut } from './authUtils';

export const AuthContext = createContext<AuthContextType>({
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
            handleFetchProfileData(currentSession.user.id);
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
        handleFetchProfileData(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const handleFetchProfileData = async (userId: string) => {
    const data = await fetchProfileData(userId);
    if (data) {
      setProfileData(data);
    }
  };

  const handleSignInWithPassword = async (email: string, password: string) => {
    clearError();
    const result = await signInWithPassword(email, password);
    if (result.error) {
      setError(result.error);
    }
    return result;
  };

  const handleSignUp = async (email: string, password: string, userData: { firstName: string, lastName: string }) => {
    clearError();
    const result = await signUp(email, password, userData);
    if (result.error) {
      setError(result.error);
    }
    return result;
  };

  const handleSignOut = async () => {
    clearError();
    const result = await signOut();
    if (result.error) {
      setError(result.error);
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
    signOut: handleSignOut,
    profileData,
    setUserProfileData,
    error,
    clearError,
    signInWithPassword: handleSignInWithPassword,
    signUp: handleSignUp
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
