import { useAuth } from "@/features/auth/hooks";
import {
  useChallenges,
  useDiscoverableChallenges,
} from "@/features/challenges/hooks";
import { ChallengeCard } from "@/features/challenges/components/ChallengeCard";

// Main Dashboard component
export const Dashboard = () => {
  // Gets authentication status
  const { isAuthenticated } = useAuth();

  // Fetches all challenges
  const { data: allChallenges = [], isLoading: loadingMy } = useChallenges({});

  // Fetches discoverable challenges
  const { data: discoverChallenges = [], isLoading: loadingDiscover } =
    useDiscoverableChallenges();

  // Filters challenges user is a member of
  const myChallenges = allChallenges.filter(
    (c) => c.userStatus === "Member" || c.userStatus === "Owner"
  );

  // Determines if either list is loading
  const loadingLists = loadingMy || loadingDiscover;

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <main className="bg-transparent text-slate-100 px-4 py-15">
        <section className="max-w-md mx-auto rounded-xl border border-slate-700/60 bg-slate-900/80 p-6 text-center">
          <h1 className="text-2xl font-semibold mb-2">
            Welcome to ChallengeTracker
          </h1>
          <p className="text-sm text-slate-400">
            Please log in to see your dashboard.
          </p>
        </section>
      </main>
    );
  }

  // Render dashboard with user's challenges and discoverable challenges
  return (
    <main className="bg-transparent text-slate-100 px-4 py-15">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                My Challenges
              </h2>
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                {myChallenges.length} Joined
              </span>
            </div>

            <div className="space-y-3">
              {loadingLists ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-slate-900/50 rounded-xl border border-slate-800"
                    ></div>
                  ))}
                </div>
              ) : myChallenges.length > 0 ? (
                myChallenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
                  <p className="text-sm text-slate-500">
                    You haven't joined any challenges yet.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Discover
              </h2>
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                Public & Open
              </span>
            </div>

            <div className="space-y-3">
              {loadingLists ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-slate-900/50 rounded-xl border border-slate-800"
                    ></div>
                  ))}
                </div>
              ) : discoverChallenges.length > 0 ? (
                discoverChallenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
                  <p className="text-sm text-slate-500">
                    No new challenges to discover right now.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
