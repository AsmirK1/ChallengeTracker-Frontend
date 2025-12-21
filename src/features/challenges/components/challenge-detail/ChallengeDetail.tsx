import { useAuth } from "@/features/auth/hooks";
import { MembershipStatus } from "@/shared/constants";
import {
  useChallengeDetail,
  useStartChallenge,
  useCompleteChallenge,
} from "../../hooks";
import {
  useLeaveChallenge,
  useUpdateMembershipStatus,
} from "@/features/memberships/hooks";
import {
  useUpdateProgressEntry,
  useDeleteProgressEntry,
} from "@/features/progress/hooks";
import { ChallengeHeader } from "./ChallengeHeader";
import { ChallengeProgress } from "./ChallengeProgress";
import { ChallengeRecentLogs } from "@/features/progress/components/ChallengeRecentLogs";
import { ChallengeSidebarInfo } from "./ChallengeSidebarInfo";
import { ChallengeLeaderboard } from "@/features/leaderboard/components/ChallengeLeaderboard";
import { ChallengeMembers } from "@/features/memberships/components/ChallengeMembers";
import { ChallengePendingRequests } from "@/features/memberships/components/ChallengePendingRequests";
import type { ChallengeDetailProps } from "../../schemas";

// Main component to display challenge details
export const ChallengeDetail = ({ challengeId }: ChallengeDetailProps) => {
  const { user } = useAuth();

  const challengeQuery = useChallengeDetail(challengeId); // Fetches challenge details
  const leaveMutation = useLeaveChallenge(challengeId); // Mutation to leave challenge
  const membershipDecisionMutation = useUpdateMembershipStatus(challengeId); // Mutation to update membership status
  const updateEntryMutation = useUpdateProgressEntry(challengeId); // Mutation to update progress entry
  const deleteEntryMutation = useDeleteProgressEntry(challengeId); // Mutation to delete progress entry
  const startMutation = useStartChallenge(challengeId); // Mutation to start challenge
  const completeMutation = useCompleteChallenge(challengeId); // Mutation to complete challenge

  // Loading state
  if (challengeQuery.isPending) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-transparent text-slate-100">
        <p className="text-slate-400">Loading challenge...</p>
      </main>
    );
  }

  // Error state
  if (challengeQuery.isError || !challengeQuery.data) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-transparent text-slate-100 px-4">
        <section className="max-w-lg w-full rounded-xl border border-slate-800 bg-slate-950/40 p-6 text-center">
          <h1 className="text-2xl font-semibold mb-2">Challenge unavailable</h1>
          <p className="text-slate-400 mb-4">
            {challengeQuery.error?.message ??
              "We couldn't load this challenge."}
          </p>
        </section>
      </main>
    );
  }

  // Successfully loaded challenge data
  const challenge = challengeQuery.data;
  // Checks if current user is creator of challenge
  const isOwner = Boolean(user?.id && challenge.creatorId === user.id);

  return (
    <main className="bg-transparent text-slate-100 px-4 py-15">
      <div className="mx-auto max-w-6xl space-y-10">
        <ChallengeHeader
          challenge={challenge}
          user={user}
          onLeave={() => {
            const membershipId = challenge.currentMembershipId;
            if (membershipId) leaveMutation.mutate(membershipId);
          }}
          onStart={() => startMutation.mutate()}
          onComplete={() => completeMutation.mutate()}
          isLeavePending={leaveMutation.isPending}
          isStartPending={startMutation.isPending}
          isCompletePending={completeMutation.isPending}
          leaveError={leaveMutation.error}
          startError={startMutation.error}
          completeError={completeMutation.error}
          membershipDecisionError={membershipDecisionMutation.error}
        />

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Progress & Logs */}
          <div className="lg:col-span-8 space-y-8">
            <ChallengeProgress challenge={challenge} />

            <ChallengeRecentLogs
              challenge={challenge}
              user={user}
              onUpdateEntry={async (entryId, amount, note) => {
                await updateEntryMutation.mutateAsync({
                  entryId,
                  payload: { amount, note },
                });
              }}
              onDeleteEntry={(entryId) => deleteEntryMutation.mutate(entryId)}
              isUpdatePending={updateEntryMutation.isPending}
            />
          </div>

          {/* Right Column: Leaderboard & Members */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6 h-fit">
            <ChallengeSidebarInfo challenge={challenge} />
            <ChallengeLeaderboard challenge={challenge} />
            <ChallengeMembers challenge={challenge} />
            <ChallengePendingRequests
              challenge={challenge}
              isCreator={isOwner}
              onApprove={(membershipId) =>
                membershipDecisionMutation.mutate({
                  membershipId,
                  payload: { status: MembershipStatus.Active },
                })
              }
              onReject={(membershipId) =>
                membershipDecisionMutation.mutate({
                  membershipId,
                  payload: { status: MembershipStatus.Rejected },
                })
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
};
