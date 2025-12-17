import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import { getUserFromStorage } from "@/shared/auth/userStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

type ChallengeResponse = {
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
    creatorId: string;
    maxEntriesPerDay: number | null;
};

const statusOptions = ["Open", "Running", "Completed"] as const;
const visibilityOptions = ["Public", "Private"] as const;

export const Testingendpoints = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetMetric, setTargetMetric] = useState("Units");
    const [targetAmount, setTargetAmount] = useState("0");
    const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    const [status, setStatus] = useState<(typeof statusOptions)[number]>("Open");
    const [visibility, setVisibility] = useState<(typeof visibilityOptions)[number]>("Public");
    const [maxEntriesPerDay, setMaxEntriesPerDay] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
        const [result, setResult] = useState<ChallengeResponse | null>(null);

    const user = useMemo(() => getUserFromStorage(), []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!user) {
            setError("You must be logged in to create a challenge.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const payload = {
                title,
                description,
                targetMetric,
                targetAmount: Number(targetAmount) || 0,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
                visibility,
                status,
                maxEntriesPerDay: maxEntriesPerDay ? Number(maxEntriesPerDay) : null,
            };

            const response = await fetch(`${API_BASE_URL}/api/challenges`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Failed to create challenge");
            }

            const data = await response.json();
            setResult(data);
            setTitle("");
            setDescription("");
            setTargetAmount("0");
            setTargetMetric("Units");
            setStatus("Open");
            setVisibility("Public");
            setMaxEntriesPerDay(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create challenge.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 text-slate-100 px-4">
                <section className="max-w-lg w-full rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-center">
                    <h1 className="text-2xl font-semibold mb-2">Create Challenge</h1>
                    <p className="text-slate-400">Please log in first to access this page.</p>
                </section>
            </main>
        );
    }

    return (
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 text-slate-100 px-4">
            <section className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/60">
                <h1 className="text-3xl font-semibold mb-4">Test: Create Challenge</h1>
                <p className="text-sm text-slate-400 mb-6">
                    Submit this form to hit <code className="text-indigo-300">POST /api/challenges</code> on the backend.
                </p>

                {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

                <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            placeholder="Seven day habit sprint"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            placeholder="Provide a short description"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Target metric</label>
                            <input
                                value={targetMetric}
                                onChange={(e) => setTargetMetric(e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Target amount</label>
                            <input
                                type="number"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                step="0.1"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Max entries/day (optional)</label>
                            <input
                                type="number"
                                min="1"
                                max="24"
                                value={maxEntriesPerDay ?? ""}
                                onChange={(e) => setMaxEntriesPerDay(e.target.value ? Number(e.target.value) : null)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="e.g. 5"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Visibility</label>
                            <select
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value as (typeof visibilityOptions)[number])}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
                            >
                                {visibilityOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as (typeof statusOptions)[number])}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-60"
                    >
                        {loading ? "Creating..." : "Create challenge"}
                    </button>
                </form>

                {result && (
                    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                        <p className="text-sm text-slate-300 mb-2">Latest response:</p>
                        <pre className="text-xs bg-slate-900 rounded-lg p-3 overflow-auto">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                )}
            </section>
        </main>
    );
};