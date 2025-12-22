import { useActionState, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-client";
import { createChallengeAction, type ActionState } from "../actions";
import type { CreateChallengeResponse } from "../schemas";
import { ChallengeStatus, ChallengeVisibility } from "@/shared/constants";
import { Button } from "@/shared/components/ui/components/Button";
import { Select } from "@/shared/components/ui/components/Select";
import { HoneypotInput } from "@/shared/components/ui/components/HoneypotInput";

// Options for status and visibility selects
const statusOptions = Object.values(ChallengeStatus).map((s) => ({
  value: s,
  label: s,
}));

// Options for visibility select
const visibilityOptions = Object.values(ChallengeVisibility).map((v) => ({
  value: v,
  label: v,
}));

// Initial state for create challenge action
const initialState: ActionState<CreateChallengeResponse> = {
  success: false,
};

// Create Challenge form component
export const CreateChallengeForm = () => {
  const navigate = useNavigate(); // Navigation hook
  const queryClient = useQueryClient(); // React Query client

  // Action state for form submission
  const [state, formAction, isPending] = useActionState(
    async (
      prev: ActionState<CreateChallengeResponse>, // Previous action state
      formData: FormData // Form data from submission
    ): Promise<ActionState<CreateChallengeResponse>> => {
      const result = await createChallengeAction(prev, formData);
      // On successful creation, invalidate challenge lists and navigate
      if (result.success && result.data) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.challenges.lists(),
        });
        // Navigate to the newly created challenge
        navigate(`/challenges/${result.data.id}`);
      }
      // Return updated action state
      return result as ActionState<CreateChallengeResponse>;
    },
    initialState
  );

  // Local state for status and visibility selects
  const [status, setStatus] = useState<string>(ChallengeStatus.Open);
  const [visibility, setVisibility] = useState<string>(
    ChallengeVisibility.Public
  );

  // Helper to get field specific error messages
  const getFieldError = (fieldName: string) => {
    if (!state.error || typeof state.error === "string") return undefined;
    return state.error[fieldName]?.[0];
  };

  return (
    <form action={formAction} className="space-y-6" autoComplete="off">
      <HoneypotInput />

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-slate-300">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          autoComplete="off"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
          placeholder="e.g., 30 Days of Code"
        />
        {getFieldError("title") && (
          <p className="text-sm text-red-500">{getFieldError("title")}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-slate-300"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          autoComplete="off"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600 resize-none"
          placeholder="Describe your challenge..."
        />
        {getFieldError("description") && (
          <p className="text-sm text-red-500">{getFieldError("description")}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Metric */}
        <div className="space-y-2">
          <label
            htmlFor="targetMetric"
            className="text-sm font-medium text-slate-300"
          >
            Target Metric
          </label>
          <input
            id="targetMetric"
            name="targetMetric"
            type="text"
            defaultValue="Units"
            autoComplete="off"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
          />
          {getFieldError("targetMetric") && (
            <p className="text-sm text-red-500">
              {getFieldError("targetMetric")}
            </p>
          )}
        </div>

        {/* Target Amount */}
        <div className="space-y-2">
          <label
            htmlFor="targetAmount"
            className="text-sm font-medium text-slate-300"
          >
            Target Amount
          </label>
          <input
            id="targetAmount"
            name="targetAmount"
            type="number"
            step="0.01"
            defaultValue={0}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
          />
          {getFieldError("targetAmount") && (
            <p className="text-sm text-red-500">
              {getFieldError("targetAmount")}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Date */}
        <div className="space-y-2">
          <label
            htmlFor="startDate"
            className="text-sm font-medium text-slate-300"
          >
            Start Date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all scheme-dark"
          />
          {getFieldError("startDate") && (
            <p className="text-sm text-red-500">{getFieldError("startDate")}</p>
          )}
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label
            htmlFor="endDate"
            className="text-sm font-medium text-slate-300"
          >
            End Date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all scheme-dark"
          />
          {getFieldError("endDate") && (
            <p className="text-sm text-red-500">{getFieldError("endDate")}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Status</label>
          <Select value={status} onChange={setStatus} options={statusOptions} />
          <input type="hidden" name="status" value={status} />
          {getFieldError("status") && (
            <p className="text-sm text-red-500">{getFieldError("status")}</p>
          )}
        </div>

        {/* Visibility */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            Visibility
          </label>
          <Select
            value={visibility}
            onChange={setVisibility}
            options={visibilityOptions}
          />
          <input type="hidden" name="visibility" value={visibility} />
          {getFieldError("visibility") && (
            <p className="text-sm text-red-500">
              {getFieldError("visibility")}
            </p>
          )}
        </div>
      </div>

      {/* Max Entries Per Day */}
      <div className="space-y-2">
        <label
          htmlFor="maxEntriesPerDay"
          className="text-sm font-medium text-slate-300"
        >
          Max Entries Per Day (Optional)
        </label>
        <input
          id="maxEntriesPerDay"
          name="maxEntriesPerDay"
          type="number"
          min="1"
          max="24"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
          placeholder="Unlimited"
        />
        {getFieldError("maxEntriesPerDay") && (
          <p className="text-sm text-red-500">
            {getFieldError("maxEntriesPerDay")}
          </p>
        )}
      </div>

      {typeof state.error === "string" && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {state.error}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isPending} isLoading={isPending}>
          Create Challenge
        </Button>
      </div>
    </form>
  );
};
