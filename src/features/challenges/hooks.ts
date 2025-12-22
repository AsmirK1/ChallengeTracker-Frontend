import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  queryKeys,
  invalidateChallengeDetail,
} from "@/shared/api/query-client";
import {
  getChallenges,
  getChallengeDetail,
  getDiscoverableChallenges,
  createChallenge,
  startChallenge,
  completeChallenge,
} from "./api";
import type {
  GetChallengesRequest,
  GetDiscoverableChallengesRequest,
  CreateChallengeRequest,
} from "./schemas";

// Hook to fetch list of challenges with optional filters
export function useChallenges(params?: GetChallengesRequest) {
  return useQuery({
    queryKey: queryKeys.challenges.list(params ?? {}),
    queryFn: () => getChallenges(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to fetch detailed information about a specific challenge
export function useChallengeDetail(challengeId: string) {
  return useQuery({
    queryKey: queryKeys.challenges.detail(challengeId),
    queryFn: () => getChallengeDetail(challengeId),
    enabled: Boolean(challengeId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to fetch list of discoverable challenges
export function useDiscoverableChallenges(
  params?: GetDiscoverableChallengesRequest
) {
  return useQuery({
    queryKey: queryKeys.challenges.discover(params ?? {}),
    queryFn: () => getDiscoverableChallenges(params),
    staleTime: 1000 * 60 * 2,
  });
}

// Hook to create a new challenge
export function useCreateChallenge() {
  const queryClient = useQueryClient();

  // Mutation to create challenge
  return useMutation({
    mutationFn: (data: CreateChallengeRequest) => createChallenge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all });
    },
  });
}

// Hook to start a challenge
export function useStartChallenge(challengeId: string) {
  const queryClient = useQueryClient();

  // Mutation to start challenge
  return useMutation({
    mutationFn: () => startChallenge(challengeId),
    onSuccess: () => {
      invalidateChallengeDetail(challengeId);
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.lists() });
    },
  });
}

// Hook to complete a challenge
export function useCompleteChallenge(challengeId: string) {
  const queryClient = useQueryClient();

  // Mutation to complete challenge
  return useMutation({
    mutationFn: () => completeChallenge(challengeId),
    onSuccess: () => {
      invalidateChallengeDetail(challengeId);
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.lists() });
    },
  });
}

// Hook to prefetch challenge detail data
export function usePrefetchChallenge() {
  const queryClient = useQueryClient();

  // Returns a function to prefetch challenge detail
  return (challengeId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.challenges.detail(challengeId),
      queryFn: () => getChallengeDetail(challengeId),
      staleTime: 1000 * 60 * 5,
    });
  };
}
