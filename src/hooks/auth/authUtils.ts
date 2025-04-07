
import { supabase } from '@/integrations/supabase/client';

export const fetchProfileData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, display_name')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching profile data:', error);
      return null;
    }
    
    if (data) {
      return {
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        displayName: data.display_name || ''
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in profile data fetch:', error);
    return null;
  }
};

export const signInWithPassword = async (email: string, password: string) => {
  try {
    console.log('Attempting to sign in with:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Signin error:', error);
      return { error: error.message };
    }

    console.log('Signin successful:', data);
    return { error: null };
  } catch (err: any) {
    console.error('Unexpected signin error:', err);
    const errorMessage = err.message || 'An unexpected error occurred. Please try again.';
    return { error: errorMessage };
  }
};

export const signUp = async (
  email: string, 
  password: string, 
  userData: { firstName: string, lastName: string }
) => {
  try {
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
    return { error: errorMessage };
  }
};

export const signOut = async () => {
  try {
    await supabase.auth.signOut();
    return { error: null };
  } catch (err: any) {
    console.error('Error signing out:', err);
    return { error: 'Failed to sign out. Please try again.' };
  }
};
