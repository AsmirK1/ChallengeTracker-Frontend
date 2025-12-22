import { Button } from "@/shared/components/ui/components/Button";
import type { ChallengePendingRequestsProps } from "../schemas";

// Component to display pending membership requests for a challenge
export const ChallengePendingRequests = ({
  challenge,
  isCreator,
  onApprove,
  onReject,
}: ChallengePendingRequestsProps) => {
  if (!isCreator || challenge.pendingMemberships.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-6">
      <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        Pending Requests
      </h2>

      <div className="space-y-3">
        {challenge.pendingMemberships.map((pending) => (
          <div
            key={pending.membershipId}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
          >
            <div>
              <p className="text-sm font-bold text-white">
                {pending.displayName}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                Requested {new Date(pending.requestedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => onApprove(pending.membershipId)}
                variant="success"
                size="sm"
                className="flex-1"
              >
                Approve
              </Button>
              <Button
                onClick={() => onReject(pending.membershipId)}
                variant="danger"
                size="sm"
                className="flex-1"
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
