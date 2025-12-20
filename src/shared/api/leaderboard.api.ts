import { api } from "./api-client";

export type LeaderboardEntry = {
  userId: string;
  userName: string;
  totalPoints: number;
  rank: number;
};

export function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return api.get<LeaderboardEntry[]>("/api/leaderboard");
}