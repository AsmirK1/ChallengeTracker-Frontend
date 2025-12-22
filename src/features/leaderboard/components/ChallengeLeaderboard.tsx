import { formatAmount } from "@/features/challenges/utils";
import type { ChallengeLeaderboardProps } from "../schemas";

// Component to display the leaderboard for a challenge
export const ChallengeLeaderboard = ({
  challenge,
}: ChallengeLeaderboardProps) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      <h3 className="text-sm font-medium text-slate-400 mb-4">Leaderboard</h3>
      {challenge.leaderboard.length === 0 ? (
        <p className="text-sm text-slate-500">No progress recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {challenge.leaderboard.map((entry, index) => (
            <div
              key={entry.userId}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`
                    flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold
                    ${
                      index === 0
                        ? "bg-yellow-500/20 text-yellow-500"
                        : index === 1
                        ? "bg-slate-400/20 text-slate-400"
                        : index === 2
                        ? "bg-orange-500/20 text-orange-500"
                        : "bg-slate-800 text-slate-500"
                    }
                  `}
                >
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-slate-200">
                  {entry.displayName}
                </span>
              </div>
              <span className="text-sm font-bold text-white">
                {formatAmount(entry.totalAmount, challenge.targetMetric)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
