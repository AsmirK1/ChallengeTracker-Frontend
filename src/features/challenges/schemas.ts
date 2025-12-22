import { z } from "zod";
import type { StoredUser } from "@/shared/auth/userStorage";
import {
  ChallengeStatus as ChallengeStatusEnum,
  ChallengeVisibility as ChallengeVisibilityEnum,
  MembershipStatus as MembershipStatusEnum,
  UserMembershipStatus as UserMembershipStatusEnum,
} from "@/shared/constants";

// Schema definitions for challenge-related data structures
export const ChallengeStatusSchema = z.nativeEnum(ChallengeStatusEnum);
export const ChallengeVisibilitySchema = z.nativeEnum(ChallengeVisibilityEnum);
export const MembershipStatusSchema = z.nativeEnum(MembershipStatusEnum);
export const UserMembershipStatusSchema = z.nativeEnum(
  UserMembershipStatusEnum
);

// Schema for a challenge member
export const MemberSchema = z.object({
  userId: z.string(),
  displayName: z.string(),
  joinedAt: z.string(),
});

// Schema for a leaderboard entry
export const LeaderboardEntrySchema = z.object({
  userId: z.string(),
  displayName: z.string(),
  totalAmount: z.number(),
});

// Schema for a pending membership
export const PendingMembershipSchema = z.object({
  membershipId: z.string(),
  userId: z.string(),
  displayName: z.string(),
  requestedAt: z.string(),
});

// Schema for a user's progress entry
export const UserProgressEntrySchema = z.object({
  entryId: z.string(),
  amount: z.number(),
  loggedAt: z.string(),
  note: z.string().nullable(),
});

// Schema for creating a new challenge
export const createChallengeSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required.")
      .max(200, "Title cannot exceed 200 characters."),
    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters.")
      .nullable()
      .optional(),
    targetMetric: z
      .string()
      .max(50, "Target metric cannot exceed 50 characters.")
      .nullable()
      .optional(),
    targetAmount: z
      .number()
      .min(0, "Target amount must be non-negative.")
      .nullable()
      .optional(),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().min(1, "End date is required."),
    visibility: ChallengeVisibilitySchema.nullable().optional(),
    status: ChallengeStatusSchema.nullable().optional(),
    maxEntriesPerDay: z
      .number()
      .int()
      .gt(0, "Max entries per day must be greater than zero.")
      .lte(24, "Max entries per day cannot exceed 24.")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: "End date must be after start date.",
      path: ["endDate"],
    }
  );

// Schema for joining a challenge
export const joinChallengeSchema = z.object({
  challengeId: z.string().uuid("Invalid challenge ID"),
});

// Schema for updating challenge status
export const updateChallengeStatusSchema = z.object({
  status: z.enum([ChallengeStatusEnum.Running, ChallengeStatusEnum.Completed]),
});

// Schema for getting a list of challenges with optional filters
export const getChallengesSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  searchTerm: z.string().optional(),
  status: ChallengeStatusSchema.optional(),
  visibility: ChallengeVisibilitySchema.optional(),
});

// Schema for getting a list of discoverable challenges
export const getDiscoverableChallengesSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  searchTerm: z.string().optional(),
});

// Schema for detailed challenge information
export const ChallengeDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  targetMetric: z.string(),
  targetAmount: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  status: ChallengeStatusSchema,
  visibility: ChallengeVisibilitySchema,
  createdAt: z.string(),
  creatorId: z.string(),
  maxEntriesPerDay: z.number().nullable(),
  creatorName: z.string(),
  memberCount: z.number(),
  members: z.array(MemberSchema),
  todaysProgress: z.number(),
  leaderboard: z.array(LeaderboardEntrySchema),
  isMember: z.boolean(),
  userProgressToday: z.number().nullable(),
  currentMembershipId: z.string().nullable(),
  currentMembershipStatus: MembershipStatusSchema.nullable(),
  pendingMemberships: z.array(PendingMembershipSchema),
  recentEntries: z.array(UserProgressEntrySchema),
});

// Schema for challenge list item
export const ChallengeListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  targetMetric: z.string(),
  targetAmount: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  status: ChallengeStatusSchema,
  visibility: ChallengeVisibilitySchema,
  createdAt: z.string(),
  maxEntriesPerDay: z.number().nullable(),
  userStatus: UserMembershipStatusSchema,
});

// Schema for create challenge response
export const CreateChallengeResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
});

// Type definitions inferred from schemas
export type ChallengeStatus = z.infer<typeof ChallengeStatusSchema>;
export type ChallengeVisibility = z.infer<typeof ChallengeVisibilitySchema>;
export type MembershipStatus = z.infer<typeof MembershipStatusSchema>;
export type UserMembershipStatus = z.infer<typeof UserMembershipStatusSchema>;

// Type definitions for various challenge related entities
export type Member = z.infer<typeof MemberSchema>;
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;
export type PendingMembership = z.infer<typeof PendingMembershipSchema>;
export type UserProgressEntry = z.infer<typeof UserProgressEntrySchema>;

// Type for create challenge request payload
export type CreateChallengeRequest = z.infer<typeof createChallengeSchema>;
export type JoinChallengeRequest = z.infer<typeof joinChallengeSchema>;
export type UpdateChallengeStatusRequest = z.infer<
  typeof updateChallengeStatusSchema
>;

// Type for join challenge request payload
export type GetChallengesRequest = z.infer<typeof getChallengesSchema>;
export type GetDiscoverableChallengesRequest = z.infer<
  typeof getDiscoverableChallengesSchema
>;

// Type for detailed challenge information
export type ChallengeDetail = z.infer<typeof ChallengeDetailSchema>;
export type ChallengeListItem = z.infer<typeof ChallengeListItemSchema>;
export type CreateChallengeResponse = z.infer<
  typeof CreateChallengeResponseSchema
>;

// Form data types
export type CreateChallengeFormData = CreateChallengeRequest;
export type JoinChallengeFormData = JoinChallengeRequest;
export type UpdateChallengeStatusFormData = UpdateChallengeStatusRequest;
export type ChallengeListItemResponse = ChallengeListItem;

// Props interfaces for challenge components
export interface ChallengeCardProps {
  challenge: ChallengeListItem;
}

// Props for ChallengeDetail component
export type ChallengeDetailProps = {
  challengeId: string;
};

// Props for ChallengeHeader component
export interface ChallengeHeaderProps {
  challenge: ChallengeDetail;
  user: StoredUser | null;
  onLeave: () => void;
  onStart: () => void;
  onComplete: () => void;
  isLeavePending: boolean;
  isStartPending: boolean;
  isCompletePending: boolean;
  leaveError: Error | null;
  startError: Error | null;
  completeError: Error | null;
  membershipDecisionError: Error | null;
}

// Props for ChallengeProgress component
export interface ChallengeProgressProps {
  challenge: ChallengeDetail;
}

// Props for ChallengeSidebarInfo component
export interface ChallengeSidebarInfoProps {
  challenge: ChallengeDetail;
}

// Props for JoinChallengeButton component
export interface JoinChallengeButtonProps {
  challengeId: string;
  onSuccess?: () => void;
  className?: string;
}

// Generic action state type
export type ActionState<T = unknown> = {
  success: boolean;
  error?: string | Record<string, string[]>;
  data?: T;
};

// Type for discoverable challenge item
export interface DiscoverChallengeItem {
  id: string;
  title: string;
  description: string;
  targetMetric: string;
  targetAmount: number;
  startDate: string;
  endDate: string;
  status: z.infer<typeof ChallengeStatusSchema>;
  createdAt: string;
  creatorId: string;
  maxEntriesPerDay: number | null;
  memberCount: number;
}

// Type for discover challenges response
export interface DiscoverChallengesResponse {
  challenges: DiscoverChallengeItem[];
  hasMore: boolean;
  nextCursor: string | null;
}
