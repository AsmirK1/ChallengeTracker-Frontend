import { z } from "zod";
import type { ChallengeDetail } from "../challenges/schemas";

// Schema for individual leaderboard entry
export const leaderboardEntryResponseSchema = z.object({
  userId: z.string(),
  displayName: z.string(),
  totalProgress: z.number(),
  rank: z.number(),
});

// Schema for leaderboard response
export const leaderboardResponseSchema = z.object({
  challengeId: z.string(),
  challengeTitle: z.string(),
  entries: z.array(leaderboardEntryResponseSchema),
});

// Types inferred from schemas
export type LeaderboardEntryResponse = z.infer<
  typeof leaderboardEntryResponseSchema
>;

// Type for leaderboard response
export type LeaderboardResponse = z.infer<typeof leaderboardResponseSchema>;

// Props for ChallengeLeaderboard component
export interface ChallengeLeaderboardProps {
  challenge: ChallengeDetail;
}
