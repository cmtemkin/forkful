
// This service is completely disabled as the Households feature is coming soon

import { Household } from "@/types/household";

// Get all households the current user belongs to (stub)
export const getUserHouseholds = async (): Promise<Household[]> => {
  return [];
};

// Create a new household (stub)
export const createHousehold = async (name: string): Promise<Household> => {
  throw new Error('Household feature is coming soon');
};

// Get household by ID (stub)
export const getHouseholdById = async (id: string): Promise<Household> => {
  throw new Error('Household feature is coming soon');
};
