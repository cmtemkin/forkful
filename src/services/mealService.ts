
import { supabase } from "@/integrations/supabase/client";

export interface Meal {
  id: string;
  title: string;
  ingredients: string[];
  image_path?: string;
  source_url?: string;
  meal_type: string;
  day: string;
  household_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  upvotes?: number;
  downvotes?: number;
  user_vote?: 'upvote' | 'downvote' | null;
}

// Create a new meal
export const createMeal = async (meal: Omit<Meal, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<Meal> => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }
  
  // Create meal without any household reference
  const mealData = {
    ...meal,
    household_id: null,  // Always set to null to avoid any household-related issues
    created_by: userData.user.id
  };
  
  console.log('Creating meal with data:', mealData);
  
  try {
    const { data, error } = await supabase
      .from('meals')
      .insert(mealData)
      .select()
      .single();

    if (error) {
      console.error('Error creating meal:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to create meal:', error);
    throw error;
  }
};

// Get meals for a household with vote counts
export const getHouseholdMeals = async (): Promise<Meal[]> => {
  // Get user ID for the current user
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) throw new Error('User not authenticated');
  
  const userId = userData.user.id;

  // Get all meals (regardless of household)
  const { data: meals, error } = await supabase
    .from('meals')
    .select(`
      id,
      title,
      ingredients,
      image_path,
      source_url,
      meal_type,
      day,
      household_id,
      created_by,
      created_at,
      updated_at
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }

  // If no meals were found, return an empty array
  if (!meals || meals.length === 0) {
    return [];
  }

  // Get votes for these meals
  const mealIds = meals.map(meal => meal.id);
  
  // Get upvotes - we need to manually count them
  const { data: upvotesData, error: upvotesError } = await supabase
    .from('meal_votes')
    .select('meal_id')
    .in('meal_id', mealIds)
    .eq('vote_type', 'upvote');
    
  // Get downvotes - we need to manually count them
  const { data: downvotesData, error: downvotesError } = await supabase
    .from('meal_votes')
    .select('meal_id')
    .in('meal_id', mealIds)
    .eq('vote_type', 'downvote');
    
  // Get user's votes
  const { data: userVotes, error: userVotesError } = await supabase
    .from('meal_votes')
    .select('meal_id, vote_type')
    .in('meal_id', mealIds)
    .eq('user_id', userId);

  // Process the data to format vote counts
  return meals.map(meal => {
    // Count upvotes and downvotes manually
    const mealUpvotes = upvotesData ? upvotesData.filter(vote => vote.meal_id === meal.id).length : 0;
    const mealDownvotes = downvotesData ? downvotesData.filter(vote => vote.meal_id === meal.id).length : 0;
    const userVote = userVotes?.find(uv => uv.meal_id === meal.id)?.vote_type || null;
    
    return {
      ...meal,
      upvotes: mealUpvotes,
      downvotes: mealDownvotes,
      user_vote: userVote as 'upvote' | 'downvote' | null
    };
  });
};

// Get a single meal by ID with vote counts
export const getMealById = async (id: string): Promise<Meal> => {
  // Get user ID for the current user
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) throw new Error('User not authenticated');
  
  const userId = userData.user.id;

  const { data: meal, error } = await supabase
    .from('meals')
    .select(`
      id,
      title,
      ingredients,
      image_path,
      source_url,
      meal_type,
      day,
      household_id,
      created_by,
      created_at,
      updated_at
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching meal:', error);
    throw error;
  }

  // Get upvotes count manually
  const { data: upvotes, error: upvotesError } = await supabase
    .from('meal_votes')
    .select('id')
    .eq('meal_id', id)
    .eq('vote_type', 'upvote');
    
  // Get downvotes count manually
  const { data: downvotes, error: downvotesError } = await supabase
    .from('meal_votes')
    .select('id')
    .eq('meal_id', id)
    .eq('vote_type', 'downvote');
    
  // Get user vote
  const { data: userVote, error: userVoteError } = await supabase
    .from('meal_votes')
    .select('vote_type')
    .eq('meal_id', id)
    .eq('user_id', userId)
    .maybeSingle();

  return {
    ...meal,
    upvotes: upvotes?.length || 0,
    downvotes: downvotes?.length || 0,
    user_vote: userVote?.vote_type as 'upvote' | 'downvote' | null || null
  };
};

// Update a meal
export const updateMeal = async (id: string, updates: Partial<Meal>): Promise<Meal> => {
  const { data, error } = await supabase
    .from('meals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating meal:', error);
    throw error;
  }

  return data;
};

// Delete a meal
export const deleteMeal = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting meal:', error);
    throw error;
  }
};

// Vote on a meal
export const voteMeal = async (mealId: string, voteType: 'upvote' | 'downvote'): Promise<void> => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) throw new Error('User not authenticated');
  
  const userId = userData.user.id;
  
  const { data: existingVote, error: checkError } = await supabase
    .from('meal_votes')
    .select('id, vote_type')
    .eq('meal_id', mealId)
    .eq('user_id', userId)
    .maybeSingle();
  
  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking existing vote:', checkError);
    throw checkError;
  }

  // If vote already exists, update it
  if (existingVote) {
    const { error } = await supabase
      .from('meal_votes')
      .update({ vote_type: voteType })
      .eq('id', existingVote.id);

    if (error) {
      console.error('Error updating vote:', error);
      throw error;
    }
  } else {
    // Otherwise, insert a new vote
    const { error } = await supabase
      .from('meal_votes')
      .insert({
        meal_id: mealId,
        user_id: userId,
        vote_type: voteType
      });

    if (error) {
      console.error('Error creating vote:', error);
      throw error;
    }
  }
};

// Remove a vote
export const removeVote = async (mealId: string): Promise<void> => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) throw new Error('User not authenticated');
  
  const userId = userData.user.id;
  
  const { error } = await supabase
    .from('meal_votes')
    .delete()
    .eq('meal_id', mealId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error removing vote:', error);
    throw error;
  }
};

// Get meals by day and meal type
export const getMealsByDayAndType = async (day: string, mealType: string): Promise<Meal[]> => {
  const { data: meals, error } = await supabase
    .from('meals')
    .select(`
      id,
      title,
      ingredients,
      image_path,
      source_url,
      meal_type,
      day,
      household_id,
      created_by,
      created_at,
      updated_at
    `)
    .eq('day', day)
    .eq('meal_type', mealType)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching meals by day and type:', error);
    throw error;
  }
  
  // Get vote counts for each meal
  if (meals && meals.length > 0) {
    const mealIds = meals.map(meal => meal.id);
    
    // Get upvotes - we need to manually count them
    const { data: upvotesData, error: upvotesError } = await supabase
      .from('meal_votes')
      .select('meal_id')
      .in('meal_id', mealIds)
      .eq('vote_type', 'upvote');
      
    // Get downvotes - we need to manually count them
    const { data: downvotesData, error: downvotesError } = await supabase
      .from('meal_votes')
      .select('meal_id')
      .in('meal_id', mealIds)
      .eq('vote_type', 'downvote');

    // Process the data to format vote counts
    return meals.map(meal => {
      // Count upvotes and downvotes manually
      const mealUpvotes = upvotesData ? upvotesData.filter(vote => vote.meal_id === meal.id).length : 0;
      const mealDownvotes = downvotesData ? downvotesData.filter(vote => vote.meal_id === meal.id).length : 0;
      
      return {
        ...meal,
        upvotes: mealUpvotes,
        downvotes: mealDownvotes
      };
    });
  }

  return meals || [];
};
