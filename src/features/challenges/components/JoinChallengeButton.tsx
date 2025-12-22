import { useActionState, useOptimistic } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-client";
import { joinChallengeAction, type ActionState } from "../actions";
import { Button } from "@/shared/components/ui/components/Button";
import type { JoinChallengeButtonProps } from "../schemas";

// Possible statuses for joining a challenge
type JoinStatus = "idle" | "joining" | "joined" | "error";

// Join Challenge button component
export const JoinChallengeButton = ({
  challengeId, // ID of challenge to join
  onSuccess, // Callback on successful join
  className, // Additional CSS classes
}: JoinChallengeButtonProps) => {
  // React Query client
  const queryClient = useQueryClient();
  // Optimistic state for join status
  const [optimisticStatus, setOptimisticStatus] =
    useOptimistic<JoinStatus>("idle");

  // Action state for form submission
  const [state, formAction, isPending] = useActionState(
    async (prev: ActionState, formData: FormData): Promise<ActionState> => {
      setOptimisticStatus("joining");

      // Perform join challenge action
      const result = await joinChallengeAction(prev, formData);

      // On successful join, update state and invalidate queries
      if (result.success) {
        setOptimisticStatus("joined"); // Update optimistic status
        // Invalidate challenge detail and list queries
        await queryClient.invalidateQueries({
          queryKey: queryKeys.challenges.detail(challengeId),
        });
        // Invalidate challenge lists
        await queryClient.invalidateQueries({
          queryKey: queryKeys.challenges.lists(),
        });
        // Call success callback if provided
        onSuccess?.();
        // Return updated action state
      } else {
        setOptimisticStatus("error");
      }

      // Return updated action state
      return result;
    },
    // Initial action state
    { success: false }
  );

  // If already joined, show joined status
  if (optimisticStatus === "joined" || state.success) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-emerald-400 font-medium ${className}`}
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        Joined
      </span>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="challengeId" value={challengeId} />
      <Button
        type="submit"
        disabled={isPending}
        isLoading={isPending}
        className={className}
      >
        {isPending ? "Joining..." : "Join Challenge"}
      </Button>
      {(state.error || optimisticStatus === "error") && (
        <p className="text-red-500 text-sm mt-2">
          {typeof state.error === "string" ? state.error : "Failed to join"}
        </p>
      )}
    </form>
  );
};
