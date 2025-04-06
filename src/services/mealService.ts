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
  const { data, error } = await supabase
    .from('meals')
    .insert(meal)
    .select()
    .single();

  if (error) {
    console.error('Error creating meal:', error);
    throw error;
  }

  return data;
};

// Get meals for a household with vote counts
export const getHouseholdMeals = async (householdId?: string): Promise<Meal[]> => {
  // Get user ID for the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  let query = supabase
    .from('meals')
    .select(`
      *,
      upvotes:meal_votes(count).filter(vote_type.eq.upvote),
      downvotes:meal_votes(count).filter(vote_type.eq.downvote),
      user_vote:meal_votes!inner(vote_type).filter(user_id.eq.${user.id})
    `);

  if (householdId) {
    query = query.eq('household_id', householdId);
  } else {
    query = query.is('household_id', null);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }

  // Process the data to format vote counts
  return (data || []).map(meal => ({
    ...meal,
    upvotes: meal.upvotes?.[0]?.count || 0,
    downvotes: meal.downvotes?.[0]?.count || 0,
    user_vote: meal.user_vote?.[0]?.vote_type || null
  }));
};

// Get a single meal by ID with vote counts
export const getMealById = async (id: string): Promise<Meal> => {
  // Get user ID for the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('meals')
    .select(`
      *,
      upvotes:meal_votes(count).filter(vote_type.eq.upvote),
      downvotes:meal_votes(count).filter(vote_type.eq.downvote),
      user_vote:meal_votes!inner(vote_type).filter(user_id.eq.${user.id})
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching meal:', error);
    throw error;
  }

  return {
    ...data,
    upvotes: data.upvotes?.[0]?.count || 0,
    downvotes: data.downvotes?.[0]?.count || 0,
    user_vote: data.user_vote?.[0]?.vote_type || null
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
  const { data: existingVote, error: checkError } = await supabase
    .from('meal_votes')
    .select('*')
    .eq('meal_id', mealId)
    .single();
  
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
  const { error } = await supabase
    .from('meal_votes')
    .delete()
    .eq('meal_id', mealId);

  if (error) {
    console.error('Error removing vote:', error);
    throw error;
  }
};

// Get meals by day and meal type
export const getMealsByDayAndType = async (day: string, mealType: string): Promise<Meal[]> => {
  const { data, error } = await supabase
    .from('meals')
    .select(`
      *,
      upvotes:meal_votes(count).filter(vote_type.eq.upvote),
      downvotes:meal_votes(count).filter(vote_type.eq.downvote)
    `)
    .eq('day', day)
    .eq('meal_type', mealType)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching meals by day and type:', error);
    throw error;
  }

  return (data || []).map(meal => ({
    ...meal,
    upvotes: meal.upvotes?.[0]?.count || 0,
    downvotes: meal.downvotes?.[0]?.count || 0
  }));
};
