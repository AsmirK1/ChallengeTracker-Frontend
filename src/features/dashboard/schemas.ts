import { z } from "zod";

// Schema for user profile response
export const userProfileResponseSchema = z.object({
  userId: z.union([z.string(), z.number()]),
  email: z.string(),
  displayName: z.string().optional(),
});

// Type for user profile response
export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>;
