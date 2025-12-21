import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-client";
import { joinChallenge, leaveChallenge, updateMembershipStatus } from "./api";
import type {
  JoinChallengeRequest,
  UpdateMembershipStatusRequest,
} from "./schemas";

// Hook to join a challenge
export function useJoinChallenge(challengeId: string) {
  const queryClient = useQueryClient();

  // Uses mutation to join a challenge and invalidates relevant queries on success
  return useMutation({
    mutationFn: (data: JoinChallengeRequest) => joinChallenge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.challenges.detail(challengeId),
      });
    },
  });
}

// Hook to leave a challenge
export function useLeaveChallenge(challengeId: string) {
  const queryClient = useQueryClient();

  // Uses mutation to leave a challenge and invalidates relevant queries on success
  return useMutation({
    mutationFn: (membershipId: string) => leaveChallenge(membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.challenges.detail(challengeId),
      });
    },
  });
}

// Hook to update membership status (approve/reject)
export function useUpdateMembershipStatus(challengeId: string) {
  const queryClient = useQueryClient();

  // Uses mutation to update membership status and invalidates relevant queries on success
  return useMutation({
    mutationFn: ({
      membershipId,
      payload,
    }: {
      membershipId: string;
      payload: UpdateMembershipStatusRequest;
    }) => updateMembershipStatus(membershipId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.challenges.detail(challengeId),
      });
    },
  });
}
