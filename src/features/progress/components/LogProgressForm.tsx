import { useActionState, useOptimistic, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-client";
import { logProgressAction, type ActionState } from "../actions";
import { Button } from "@/shared/components/ui/components/Button";
import type { LogProgressFormProps } from "../schemas";

// Possible statuses for form submission
type SubmitStatus = "idle" | "submitting" | "success" | "error";

// Form component for logging progress in a challenge
export const LogProgressForm = ({
  challengeId, // ID of the challenge
  targetMetric, // Metric being targeted (e.g., "km", "pages")
  onSuccess, // Optional callback on successful submission
}: LogProgressFormProps) => {
  // Query client for cache management
  const queryClient = useQueryClient();
  // Ref for the form element
  const formRef = useRef<HTMLFormElement>(null);

  // Optimistic state for submission status
  const [optimisticStatus, setOptimisticStatus] =
    useOptimistic<SubmitStatus>("idle");

  // Action state for form submission
  const [state, formAction, isPending] = useActionState(
    async (prev: ActionState, formData: FormData): Promise<ActionState> => {
      setOptimisticStatus("submitting");

      // Calls log progress action
      const result = await logProgressAction(prev, formData);

      // Handles success and error states
      if (result.success) {
        setOptimisticStatus("success");
        formRef.current?.reset();

        // Invalidate relevant queries to refresh data
        await queryClient.invalidateQueries({
          queryKey: queryKeys.challenges.detail(challengeId),
        });
        // Invalidate leaderboard data for the challenge
        await queryClient.invalidateQueries({
          queryKey: queryKeys.leaderboard.byChallenge(challengeId),
        });

        // Calls optional success callback
        onSuccess?.();
        setTimeout(() => setOptimisticStatus("idle"), 1500);
        // Catches errors
      } else {
        setOptimisticStatus("error");
      }

      // Returns the result of the action
      return result;
    },
    // Initial state
    { success: false }
  );

  // Renders form
  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4"
      autoComplete="off"
    >
      <input type="hidden" name="challengeId" value={challengeId} />

      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-slate-300 mb-1"
        >
          Amount ({targetMetric})
        </label>
        <input
          type="number"
          name="amount"
          id="amount"
          step="any"
          required
          autoComplete="off"
          placeholder="e.g., 5.5"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="note"
          className="block text-sm font-medium text-slate-300 mb-1"
        >
          Note (Optional)
        </label>
        <textarea
          name="note"
          id="note"
          rows={2}
          autoComplete="off"
          placeholder="Add a note about your progress..."
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-slate-300 mb-1"
          >
            Date (Optional)
          </label>
          <input
            type="date"
            name="date"
            id="date"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none scheme-dark"
          />
        </div>
        <div>
          <label
            htmlFor="time"
            className="block text-sm font-medium text-slate-300 mb-1"
          >
            Time (Optional)
          </label>
          <input
            type="time"
            name="time"
            id="time"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none scheme-dark"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        isLoading={isPending}
        className="w-full"
      >
        {isPending
          ? "Logging..."
          : optimisticStatus === "success"
          ? "✓ Logged!"
          : "Log Progress"}
      </Button>

      {(state.error || optimisticStatus === "error") && (
        <div className="text-red-500 text-sm">
          {typeof state.error === "string"
            ? state.error
            : "Failed to log progress"}
        </div>
      )}
    </form>
  );
};
