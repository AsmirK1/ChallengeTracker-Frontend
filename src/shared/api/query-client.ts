import { QueryClient } from "@tanstack/react-query";
import { isApiError, isProblemDetailsError } from "./api-client";

// Determines if a query should be retried based on the error type and failure count
const shouldRetry = (failureCount: number, error: unknown): boolean => {
  if (isApiError(error) && error.status >= 400 && error.status < 500) {
    return false;
  }

  // Do not retry for Problem Details errors
  if (isProblemDetailsError(error)) {
    return false;
  }

  // Retry up to 2 times for other errors
  return failureCount < 2;
};

// Initializes the QueryClient with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes

      gcTime: 1000 * 60 * 10, // 10 minutes

      retry: shouldRetry, // Custom retry logic

      refetchOnWindowFocus: false, // Disable refetch on window focus

      refetchOnMount: false, // Disable refetch on mount

      refetchOnReconnect: true, // Enable refetch on reconnect
    },
    mutations: {
      retry: false, // Do not retry mutations
    },
  },
});

// Query key definitions for various data types
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    currentUser: () => [...queryKeys.auth.all, "me"] as const,
  },

  // Query keys related to challenges
  challenges: {
    all: ["challenges"] as const,
    lists: () => [...queryKeys.challenges.all, "list"] as const,
    list: (filters: object) =>
      [...queryKeys.challenges.lists(), filters] as const,
    discover: (params: object) =>
      [...queryKeys.challenges.all, "discover", params] as const,
    details: () => [...queryKeys.challenges.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.challenges.details(), id] as const,
  },

  // Query keys related to leaderboard data
  leaderboard: {
    all: ["leaderboard"] as const,
    byChallenge: (challengeId: string) =>
      [...queryKeys.leaderboard.all, challengeId] as const,
  },

  // Query keys related to user data
  user: {
    all: ["user"] as const,
    challenges: (userId: string) =>
      [...queryKeys.user.all, userId, "challenges"] as const,
    progress: (userId: string, challengeId: string) =>
      [...queryKeys.user.all, userId, "progress", challengeId] as const,
  },
} as const;

// Prefetches challenge detail data and caches it
export const prefetchChallengeDetail = async (
  challengeId: string,
  fetchFn: () => Promise<unknown>
): Promise<void> => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.challenges.detail(challengeId),
    queryFn: fetchFn,
    staleTime: 1000 * 60 * 5,
  });
};

// Invalidates cached challenge list data
export const invalidateChallenges = (): Promise<void> => {
  return queryClient.invalidateQueries({
    queryKey: queryKeys.challenges.all,
  });
};

// Invalidates cached data for a specific challenge detail
export const invalidateChallengeDetail = (
  challengeId: string
): Promise<void> => {
  return queryClient.invalidateQueries({
    queryKey: queryKeys.challenges.detail(challengeId),
  });
};
