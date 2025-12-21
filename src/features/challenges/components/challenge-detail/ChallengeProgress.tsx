import { formatDate } from "@/shared/utils/date";
import { LogProgressForm } from "@/features/progress/components/LogProgressForm";
import { formatAmount } from "../../utils";
import type { ChallengeProgressProps } from "../../schemas";

// Component to display challenge progress and log new entries
export const ChallengeProgress = ({ challenge }: ChallengeProgressProps) => {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          Today's Activity
        </h2>
        <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
          {formatDate(new Date().toISOString(), {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-slate-900/50 p-4 border border-slate-800/50">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Community Total
          </p>
          <p className="text-3xl font-bold text-white mt-1">
            {formatAmount(challenge.todaysProgress, challenge.targetMetric)}
          </p>
        </div>
        <div className="rounded-xl bg-blue-500/5 p-4 border border-blue-500/10">
          <p className="text-xs font-medium text-blue-400 uppercase tracking-wider">
            My Contribution
          </p>
          <p className="text-3xl font-bold text-white mt-1">
            {challenge.userProgressToday !== null
              ? formatAmount(
                  challenge.userProgressToday,
                  challenge.targetMetric
                )
              : "0 " + challenge.targetMetric}
          </p>
        </div>
      </div>

      {challenge.isMember && (
        <div className="mt-6 space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Log New Progress
            </h3>
            {challenge.maxEntriesPerDay && (
              <span className="text-[10px] text-slate-500">
                Limit: {challenge.maxEntriesPerDay} entries/day
              </span>
            )}
          </div>
          <LogProgressForm
            challengeId={challenge.id}
            targetMetric={challenge.targetMetric}
          />
        </div>
      )}
    </section>
  );
};
