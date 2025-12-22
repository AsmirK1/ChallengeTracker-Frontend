import type { ChallengeMembersProps } from "../schemas";

// Component to display members of a challenge
export const ChallengeMembers = ({ challenge }: ChallengeMembersProps) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400">Members</h3>
        <span className="text-xs text-slate-500">
          {challenge.members.length} active
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {challenge.members.map((member) => (
          <div
            key={member.userId}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 border border-slate-800"
          >
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-slate-300">
              {member.displayName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
