import { z } from "zod";
import { MembershipStatus } from "@/shared/constants";
import type { ChallengeDetail } from "../challenges/schemas";

// Schema for joining a challenge
export const joinChallengeSchema = z.object({
  challengeId: z
    .string()
    .min(1, "Challenge ID is required.")
    .uuid("Invalid challenge ID format."),
});

// Type for joining a challenge form data
export type JoinChallengeFormData = z.infer<typeof joinChallengeSchema>;

// Schema for updating membership status
export const updateMembershipStatusSchema = z.object({
  status: z.enum([MembershipStatus.Active, MembershipStatus.Rejected], {
    message: "Status must be Active or Rejected.",
  }),
});

// Type for updating membership status form data
export type UpdateMembershipStatusFormData = z.infer<
  typeof updateMembershipStatusSchema
>;

// Request schema for joining a challenge
export const joinChallengeRequestSchema = z.object({
  challengeId: z.string(),
});

// Type for joining a challenge request
export type JoinChallengeRequest = z.infer<typeof joinChallengeRequestSchema>;

// Request schema for updating membership status
export const updateMembershipStatusRequestSchema = z.object({
  status: z.enum([MembershipStatus.Active, MembershipStatus.Rejected]),
});

// Type for updating membership status request
export type UpdateMembershipStatusRequest = z.infer<
  typeof updateMembershipStatusRequestSchema
>;

// Response schema for joining a challenge
export const joinChallengeResponseSchema = z.object({
  id: z.string(),
  challengeId: z.string(),
  userId: z.string(),
  status: z.nativeEnum(MembershipStatus),
  joinedAt: z.string(),
});

// Props for ChallengeMembers component
export interface ChallengeMembersProps {
  challenge: ChallengeDetail;
}

// Props for ChallengePendingRequests component
export interface ChallengePendingRequestsProps {
  challenge: ChallengeDetail;
  isCreator: boolean;
  onApprove: (membershipId: string) => void;
  onReject: (membershipId: string) => void;
}

// Type for joining a challenge response
export type JoinChallengeResponse = z.infer<typeof joinChallengeResponseSchema>;

// Response schema for updating membership status
export const updateMembershipStatusResponseSchema = z.object({
  id: z.string(),
  challengeId: z.string(),
  userId: z.string(),
  status: z.nativeEnum(MembershipStatus),
  joinedAt: z.string(),
});

// Type for updating membership status response
export type UpdateMembershipStatusResponse = z.infer<
  typeof updateMembershipStatusResponseSchema
>;

// Generic action state type
export type ActionState<T = unknown> = {
  success: boolean;
  error?: string | Record<string, string[]>;
  data?: T;
};
