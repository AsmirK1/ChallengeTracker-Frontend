import { api } from "@/shared/api/api-client";
import { leaderboardResponseSchema, type LeaderboardResponse } from "./schemas";

// Base API version for leaderboard endpoints
const API_VERSION = "/api/v1";

// Retrieves leaderboard for a specific challenge
export async function getLeaderboard(
  challengeId: string
): Promise<LeaderboardResponse> {
  const response = await api.get(`${API_VERSION}/leaderboard/${challengeId}`);
  return leaderboardResponseSchema.parse(response);
}
