
// This service is deprecated as the Households feature is coming soon
// All functionality has been disabled to avoid interference with the rest of the app

import { HouseholdMember } from "@/types/household";

// Exporting empty functions to maintain imports elsewhere
export const getHouseholdMembers = async (): Promise<HouseholdMember[]> => [];
export const addHouseholdMember = async (): Promise<void> => {};
export const removeHouseholdMember = async (): Promise<void> => {};
export const updateMemberRole = async (): Promise<void> => {};
export const isUserHouseholdAdmin = async (): Promise<boolean> => false;
