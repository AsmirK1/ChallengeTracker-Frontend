import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

type ChallengeSummary = {
    id: string;
    title: string;
    description: string;
    targetMetric: string;
    targetAmount: number;
    startDate: string;
    endDate: string;
    status: string;
    visibility: string;
    createdAt: string;
    maxEntriesPerDay: number | null;
};

const statusOptions = ["Open", "Running", "Completed"] as const;
const visibilityOptions = ["Public", "Private"] as const;

export const ChallengeListPage = () => {
    const [visibility, setVisibility] = useState<(typeof visibilityOptions)[number]>("Public");
    const [status, setStatus] = useState<(typeof statusOptions)[number]>("Open");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [challenges, setChallenges] = useState<ChallengeSummary[]>([]);

    const filters = useMemo(() => ({ visibility, status }), [visibility, status]);

    useEffect(() => {
        const fetchChallenges = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();
                if (filters.visibility) params.append("visibility", filters.visibility);
                if (filters.status) params.append("status", filters.status);

                const response = await fetch(`${API_BASE_URL}/api/challenges?${params.toString()}`);
                if (!response.ok) {
                    const message = await response.text();
                    throw new Error(message || "Failed to load challenges");
                }

                const data = (await response.json()) as ChallengeSummary[];
                setChallenges(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load challenges.");
                setChallenges([]);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, [filters]);

    return (
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 text-slate-100 px-4">
            <section className="w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/60">
                <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-semibold">Test: List Challenges</h1>
                        <p className="text-sm text-slate-400">
                            Fetches <code className="text-indigo-300">GET /api/challenges</code> with optional filters.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <label className="flex items-center gap-2 text-sm">
                            Visibility
                            <select
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value as (typeof visibilityOptions)[number])}
                                className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-slate-100"
                            >
                                {visibilityOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                            Status
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as (typeof statusOptions)[number])}
                                className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-slate-100"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </header>

                {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
                {loading && <p className="text-sm text-slate-400 mb-4">Loading challenges...</p>}

                <div className="space-y-4">
                    {challenges.length === 0 && !loading ? (
                        <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4 text-center text-sm text-slate-400">
                            No challenges found for the current filters.
                        </div>
                    ) : (
                        challenges.map((challenge) => (
                            <article
                                key={challenge.id}
                                className="rounded-xl border border-slate-800 bg-slate-950/40 p-5"
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                    <div>
                                        <h2 className="text-xl font-semibold text-white">{challenge.title}</h2>
                                        <p className="text-sm text-slate-400 mb-2">{challenge.description || "No description."}</p>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <span className="rounded-full border border-indigo-400/30 px-3 py-1 text-indigo-200">
                                            {challenge.visibility}
                                        </span>
                                        <span className="rounded-full border border-emerald-400/30 px-3 py-1 text-emerald-200">
                                            {challenge.status}
                                        </span>
                                    </div>
                                </div>

                                <dl className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
                                    <div>
                                        <dt className="text-slate-500">Timeline</dt>
                                        <dd>
                                            {new Date(challenge.startDate).toLocaleDateString()} – {" "}
                                            {new Date(challenge.endDate).toLocaleDateString()}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500">Target</dt>
                                        <dd>
                                            {challenge.targetAmount} {challenge.targetMetric}
                                            {challenge.maxEntriesPerDay ? (
                                                <span className="block text-xs text-slate-500">
                                                    Up to {challenge.maxEntriesPerDay} entries/day
                                                </span>
                                            ) : null}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500">Created at</dt>
                                        <dd>{new Date(challenge.createdAt).toLocaleString()}</dd>
                                    </div>
                                </dl>

                                <div className="mt-4 text-right">
                                    <Link
                                        to={`/challenges/${challenge.id}`}
                                        className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                                    >
                                        View detail
                                    </Link>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
};