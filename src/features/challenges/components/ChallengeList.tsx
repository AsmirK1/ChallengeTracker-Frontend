import { useEffect, useState } from "react";
import { useChallenges } from "../hooks";
import { ChallengeStatus, ChallengeVisibility } from "@/shared/constants";
import { ChallengeCard } from "./ChallengeCard";
import { Select } from "@/shared/components/ui/components/Select";

// Options for filtering challenges
const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: ChallengeStatus.Open, label: ChallengeStatus.Open },
  { value: ChallengeStatus.Running, label: ChallengeStatus.Running },
  { value: ChallengeStatus.Completed, label: ChallengeStatus.Completed },
];

// Options for filtering challenges by visibility
const visibilityOptions = [
  { value: "", label: "All Visibilities" },
  { value: ChallengeVisibility.Public, label: ChallengeVisibility.Public },
  { value: ChallengeVisibility.Private, label: ChallengeVisibility.Private },
];

// Main component to list and filter challenges
export const ChallengeList = () => {
  const [visibility, setVisibility] = useState<ChallengeVisibility | "">(""); // State for selected visibility filter
  const [status, setStatus] = useState<ChallengeStatus | "">(""); // State for selected status filter
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Debounced search term

  // Debounce search input to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    // Cleanup timeout on unmount or searchTerm change
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch challenges based on filters and search term
  const {
    data: challenges = [],
    isLoading,
    error,
  } = useChallenges({
    visibility: visibility || undefined,
    status: status || undefined,
    searchTerm: debouncedSearch || undefined,
  });

  return (
    <main className="bg-transparent text-slate-100 px-4 py-15">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Browse Challenges
            </h1>
            <p className="text-slate-400 mt-2">
              Discover and join challenges from the community.
            </p>
          </div>
        </header>

        <section className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-end mb-8">
            <div className="col-span-1 lg:col-span-2">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-slate-400 mb-2"
              >
                Search
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 pl-11 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="col-span-1 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Visibility
                </label>
                <Select
                  value={visibility}
                  onChange={(val) =>
                    setVisibility(val as ChallengeVisibility | "")
                  }
                  options={visibilityOptions}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Status
                </label>
                <Select
                  value={status}
                  onChange={(val) => setStatus(val as ChallengeStatus | "")}
                  options={statusOptions}
                />
              </div>
            </div>
          </div>

          {isLoading && challenges.length === 0 && (
            <div className="flex justify-center py-12">
              <p className="text-slate-400">Loading challenges...</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-900/50 bg-red-900/10 p-4 text-center text-red-400">
              <p>
                {error instanceof Error
                  ? error.message
                  : "Failed to load challenges."}
              </p>
            </div>
          )}

          {(challenges.length > 0 || (!isLoading && !error)) && (
            <div
              className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${
                isLoading ? "opacity-50" : "opacity-100"
              }`}
            >
              {challenges.length > 0 ? (
                challenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-slate-500">
                    No challenges found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
