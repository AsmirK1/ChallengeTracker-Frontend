import { api } from "@/shared/api/api-client";
import { userProfileResponseSchema, type UserProfileResponse } from "./schemas";

// Base API version for dashboard endpoints
const API_VERSION = "/api/v1";

// Fetches the profile of the currently authenticated user
export async function fetchUserProfile(): Promise<UserProfileResponse> {
  const response = await api.get(`${API_VERSION}/auth/me`);
  return userProfileResponseSchema.parse(response);
}
