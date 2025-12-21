import { Button } from "@/shared/components/ui/components/Button";
import { JoinChallengeButton } from "../JoinChallengeButton";
import type { ChallengeHeaderProps } from "../../schemas";
import { MembershipStatus } from "@/shared/constants";

// Component to display challenge header with actions
export const ChallengeHeader = ({
  challenge, // Challenge data
  user, // Current authenticated user
  onLeave, // Handler for leaving challenge
  onStart, // Handler for starting challenge
  onComplete, // Handler for completing challenge
  isLeavePending, // Loading state for leave action
  isStartPending, // Loading state for start action
  isCompletePending, // Loading state for complete action
  leaveError, // Error state for leave action
  startError, // Error state for start action
  completeError, // Error state for complete action
  membershipDecisionError, // Error state for membership decision action
}: ChallengeHeaderProps) => {
  // Destructure props
  const canMutate = Boolean(user?.token); // Checks if user can perform mutations
  const isOwner = Boolean(user?.id && challenge.creatorId === user.id); // Checks if user is challenge owner
  const membershipId = challenge.currentMembershipId; // Current membership ID
  const membershipStatus = challenge.currentMembershipStatus; // Current membership status
  const hasPendingMembership = membershipStatus === MembershipStatus.Pending; // Checks for pending membership

  return (
    <header className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
              {challenge.visibility}
            </span>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              {challenge.status}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {challenge.title}
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
            {challenge.description || "No description provided."}
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500 pt-2">
            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
              {challenge.creatorName.charAt(0).toUpperCase()}
            </div>
            <span>
              Created by{" "}
              <span className="text-slate-300 font-medium">
                {challenge.creatorName}
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {challenge.isMember && membershipId ? (
            <Button
              onClick={onLeave}
              variant="danger"
              size="md"
              isLoading={isLeavePending}
              disabled={!canMutate}
            >
              Leave challenge
            </Button>
          ) : hasPendingMembership ? (
            <div className="flex flex-wrap items-center gap-3">
              {membershipId && (
                <Button
                  onClick={onLeave}
                  variant="outline"
                  size="md"
                  isLoading={isLeavePending}
                  disabled={!canMutate}
                >
                  Cancel request
                </Button>
              )}
              <p className="text-sm text-yellow-200 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1.5 rounded-lg">
                Waiting for owner approval
              </p>
            </div>
          ) : (
            <JoinChallengeButton challengeId={challenge.id} className="px-10" />
          )}

          {isOwner && (
            <>
              {challenge.status === "Open" && (
                <Button
                  onClick={onStart}
                  variant="success"
                  size="md"
                  isLoading={isStartPending}
                  disabled={!canMutate}
                >
                  Start challenge
                </Button>
              )}
              {challenge.status === "Running" && (
                <Button
                  onClick={onComplete}
                  variant="primary"
                  size="md"
                  isLoading={isCompletePending}
                  disabled={!canMutate}
                >
                  Complete challenge
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {(leaveError ||
        startError ||
        completeError ||
        membershipDecisionError) && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
          <p className="text-xs text-red-400">
            {leaveError?.message ||
              startError?.message ||
              completeError?.message ||
              membershipDecisionError?.message}
          </p>
        </div>
      )}
    </header>
  );
};
