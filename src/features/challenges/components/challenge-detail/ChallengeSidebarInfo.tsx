import { formatDate } from "@/shared/utils/date";
import { formatAmount } from "../../utils";
import type { ChallengeSidebarInfoProps } from "../../schemas";

// Component to display sidebar information about a challenge
export const ChallengeSidebarInfo = ({
  challenge,
}: ChallengeSidebarInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
        <h3 className="text-sm font-medium text-slate-400 mb-4">
          Challenge Details
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Goal</p>
            <p className="text-sm font-medium text-slate-200">
              {formatAmount(challenge.targetAmount, challenge.targetMetric)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Duration</p>
            <p className="text-sm font-medium text-slate-200">
              {formatDate(challenge.startDate)} -{" "}
              {formatDate(challenge.endDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Creator</p>
            <p className="text-sm font-medium text-slate-200">
              {challenge.creatorName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
