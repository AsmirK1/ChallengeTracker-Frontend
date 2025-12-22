import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-client";
import {
  createProgressEntry,
  updateProgressEntry,
  deleteProgressEntry,
} from "./api";
import type {
  CreateProgressEntryRequest,
  UpdateProgressEntryRequest,
} from "./schemas";

// Hook to create a new progress entry
export function useCreateProgressEntry(challengeId: string) {
  const queryClient = useQueryClient();

  // Uses mutation to create progress entry and invalidate relevant queries on success
  return useMutation({
    mutationFn: (data: CreateProgressEntryRequest) => createProgressEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.challenges.detail(challengeId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leaderboard.byChallenge(challengeId),
      });
    },
  });
}

// Hook to update an existing progress entry
export function useUpdateProgressEntry(challengeId: string) {
  const queryClient = useQueryClient();

  // Uses mutation to update progress entry and invalidate relevant queries on success
  return useMutation({
    mutationFn: ({
      entryId,
      payload,
    }: {
      entryId: string;
      payload: UpdateProgressEntryRequest;
    }) => updateProgressEntry(entryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.challenges.detail(challengeId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leaderboard.byChallenge(challengeId),
      });
    },
  });
}

// Hook to delete a progress entry
export function useDeleteProgressEntry(challengeId: string) {
  const queryClient = useQueryClient();

  // Uses mutation to delete progress entry and invalidate relevant queries on success
  return useMutation({
    mutationFn: (entryId: string) => deleteProgressEntry(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.challenges.detail(challengeId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leaderboard.byChallenge(challengeId),
      });
    },
  });
}
