import { Link } from "react-router-dom";
import type { ChallengeCardProps } from "../schemas";
import { UserMembershipStatus } from "@/shared/constants";

// Component to display a summary card for a challenge
export const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  return (
    <Link
      to={`/challenges/${challenge.id}`}
      className="group block h-full rounded-xl border border-slate-800 bg-slate-950/40 p-5 hover:border-blue-500/50 hover:bg-slate-900/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300"
    >
      <article className="flex h-full flex-col justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
              {challenge.title}
            </h3>
            <div className="flex shrink-0 gap-2">
              <span className="rounded-full border border-blue-400/20 bg-blue-400/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                {challenge.visibility}
              </span>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                {challenge.status}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-400 line-clamp-3 min-h-[4.5em] leading-relaxed">
            {challenge.description || "No description provided."}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/50 pt-4 mt-2">
          <div className="text-xs font-medium text-slate-500">
            {challenge.userStatus === UserMembershipStatus.Member && (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Joined
              </span>
            )}
            {challenge.userStatus === UserMembershipStatus.Owner && (
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                Owner
              </span>
            )}
            {challenge.userStatus === UserMembershipStatus.NotJoined && (
              <span className="text-slate-600">Not joined</span>
            )}
          </div>

          <span className="text-xs font-semibold text-blue-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            View Details →
          </span>
        </div>
      </article>
    </Link>
  );
};
