import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { getUserFromStorage } from "@/shared/auth/userStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

type Member = {
  userId: string;
  displayName: string;
  joinedAt: string;
};

type LeaderboardEntry = {
  userId: string;
  displayName: string;
  totalAmount: number;
};

type MembershipStatus = "Pending" | "Active" | "Rejected";

type PendingMembership = {
  membershipId: string;
  userId: string;
  displayName: string;
  requestedAt: string;
};

type MembershipResponse = {
  id: string;
  challengeId: string;
  userId: string;
  status: MembershipStatus;
  joinedAt: string;
};

type MembershipActionResponse = {
  success: boolean;
  message: string;
};

type UserProgressEntry = {
  entryId: string;
  amount: number;
  loggedAt: string;
  note: string | null;
};

type ProgressEntryResponse = {
  id: string;
  amount: number;
  loggedAt: string;
  note: string | null;
};

type CreateProgressEntryPayload = {
  challengeId: string;
  amount: number;
  note: string | null;
  loggedAt?: string;
};

type ChallengeDetail = {
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
  creatorName: string;
  memberCount: number;
  members: Member[];
  todaysProgress: number;
  leaderboard: LeaderboardEntry[];
  isMember: boolean;
  userProgressToday: number | null;
  currentMembershipId: string | null;
  currentMembershipStatus: MembershipStatus | null;
  pendingMemberships: PendingMembership[];
  recentEntries: UserProgressEntry[];
};

const formatAmount = (value: number, metric: string) =>
  `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${metric}`;

const normalizeChallengeDetail = (data: Partial<ChallengeDetail>): ChallengeDetail => ({
  id: data.id ?? "",
  title: data.title ?? "",
  description: data.description ?? "",
  targetMetric: data.targetMetric ?? "Units",
  targetAmount: data.targetAmount ?? 0,
  startDate: data.startDate ?? new Date().toISOString(),
  endDate: data.endDate ?? new Date().toISOString(),
  status: data.status ?? "Open",
  visibility: data.visibility ?? "Public",
  createdAt: data.createdAt ?? new Date().toISOString(),
  creatorId: data.creatorId ?? "",
  maxEntriesPerDay: data.maxEntriesPerDay ?? null,
  creatorName: data.creatorName ?? "Unknown",
  memberCount: data.memberCount ?? (data.members?.length ?? 0),
  members: data.members ?? [],
  todaysProgress: data.todaysProgress ?? 0,
  leaderboard: data.leaderboard ?? [],
  isMember: data.isMember ?? false,
  userProgressToday: data.userProgressToday ?? null,
  currentMembershipId: data.currentMembershipId ?? null,
  currentMembershipStatus: data.currentMembershipStatus ?? null,
  pendingMemberships: data.pendingMemberships ?? [],
  recentEntries: data.recentEntries ?? [],
});

export const ChallengeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const user = useMemo(() => getUserFromStorage(), []);
  const [progressAmount, setProgressAmount] = useState("0");
  const [progressNote, setProgressNote] = useState("");
  const [progressLoggedAt, setProgressLoggedAt] = useState("");
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editFormError, setEditFormError] = useState<string | null>(null);

  const challengeQuery = useQuery<ChallengeDetail, Error>({
    queryKey: ["challenge", id, user?.token],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) throw new Error("Missing challenge id");
      const response = await fetch(`${API_BASE_URL}/api/challenges/${id}`, {
        headers: user?.token
          ? {
              Authorization: `Bearer ${user.token}`,
            }
          : undefined,
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to load challenge");
      }

      const raw = (await response.json()) as Partial<ChallengeDetail>;
      return normalizeChallengeDetail(raw);
    },
  });

  const invalidateChallenge = () => {
    queryClient.invalidateQueries({ queryKey: ["challenge", id] });
  };

  const joinMutation = useMutation<MembershipResponse, Error>({
    mutationFn: async () => {
      if (!user?.token) throw new Error("You must be logged in.");
      if (!id) throw new Error("Missing challenge id");

      const response = await fetch(`${API_BASE_URL}/api/memberships`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ challengeId: id }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to join challenge");
      }

      return response.json();
    },
    onSuccess: invalidateChallenge,
  });

  const leaveMutation = useMutation<MembershipActionResponse, Error>({
    mutationFn: async () => {
      if (!user?.token) throw new Error("You must be logged in.");
      const membershipId = challengeQuery.data?.currentMembershipId;
      if (!membershipId) throw new Error("No membership to remove.");

      const response = await fetch(`${API_BASE_URL}/api/memberships/${membershipId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to leave challenge");
      }

      return response.json();
    },
    onSuccess: invalidateChallenge,
  });

  const membershipDecisionMutation = useMutation<
    MembershipResponse,
    Error,
    { membershipId: string; status: MembershipStatus }
  >({
    mutationFn: async ({ membershipId, status }) => {
      if (!user?.token) throw new Error("You must be logged in.");

      const response = await fetch(`${API_BASE_URL}/api/memberships/${membershipId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to update membership");
      }

      return response.json();
    },
    onSuccess: invalidateChallenge,
  });

  const logMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Missing challenge id");
      if (!user?.token) throw new Error("You must be logged in.");

      const amountValue = Number(progressAmount);
      if (!Number.isFinite(amountValue) || amountValue <= 0) {
        throw new Error("Amount must be greater than zero");
      }

      const trimmedNote = progressNote.trim();
      const payload: CreateProgressEntryPayload = {
        challengeId: id,
        amount: amountValue,
        note: trimmedNote.length > 0 ? trimmedNote : null,
        loggedAt: progressLoggedAt ? new Date(progressLoggedAt).toISOString() : undefined,
      };

      const response = await fetch(`${API_BASE_URL}/api/progress-entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to log progress");
      }

      return response.json();
    },
    onSuccess: () => {
      setProgressAmount("0");
      setProgressNote("");
      setProgressLoggedAt("");
      invalidateChallenge();
    },
  });

  const updateEntryMutation = useMutation<
    ProgressEntryResponse,
    Error,
    { entryId: string; amount: number; note: string | null }
  >({
    mutationFn: async ({ entryId, amount, note }) => {
      if (!user?.token) throw new Error("You must be logged in.");

      const response = await fetch(`${API_BASE_URL}/api/progress-entries/${entryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ amount, note }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to update progress entry");
      }

      return response.json();
    },
    onSuccess: () => {
      setEditingEntryId(null);
      setEditAmount("");
      setEditNote("");
      setEditFormError(null);
      invalidateChallenge();
    },
  });

  const deleteEntryMutation = useMutation<void, Error, string>({
    mutationFn: async (entryId) => {
      if (!user?.token) throw new Error("You must be logged in.");

      const response = await fetch(`${API_BASE_URL}/api/progress-entries/${entryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to delete progress entry");
      }
    },
    onSuccess: () => {
      if (editingEntryId) {
        setEditingEntryId(null);
        setEditAmount("");
        setEditNote("");
        setEditFormError(null);
      }
      invalidateChallenge();
    },
  });

  const startMutation = useMutation<{ challengeId: string; status: string }, Error>({
    mutationFn: async () => {
      if (!id) throw new Error("Missing challenge id");
      if (!user?.token) throw new Error("You must be logged in.");

      const response = await fetch(`${API_BASE_URL}/api/challenges/${id}/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to start challenge");
      }

      return response.json();
    },
    onSuccess: invalidateChallenge,
  });

  const completeMutation = useMutation<{ challengeId: string; status: string }, Error>({
    mutationFn: async () => {
      if (!id) throw new Error("Missing challenge id");
      if (!user?.token) throw new Error("You must be logged in.");

      const response = await fetch(`${API_BASE_URL}/api/challenges/${id}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to complete challenge");
      }

      return response.json();
    },
    onSuccess: invalidateChallenge,
  });

  if (challengeQuery.isPending) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-slate-400">Loading challenge...</p>
      </main>
    );
  }

  if (challengeQuery.isError || !challengeQuery.data) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 text-slate-100 px-4">
        <section className="max-w-lg w-full rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-center">
          <h1 className="text-2xl font-semibold mb-2">Challenge unavailable</h1>
          <p className="text-slate-400 mb-4">{challengeQuery.error?.message ?? "We couldn't load this challenge."}</p>
        </section>
      </main>
    );
  }

  const challenge = challengeQuery.data;
  const canMutate = Boolean(user?.token);
  const isOwner = Boolean(user?.id && challenge.creatorId === user.id);
  const membershipId = challenge.currentMembershipId;
  const membershipStatus = challenge.currentMembershipStatus;
  const hasPendingMembership = membershipStatus === "Pending";

  const startEditingEntry = (entry: UserProgressEntry) => {
    setEditingEntryId(entry.entryId);
    setEditAmount(entry.amount.toString());
    setEditNote(entry.note ?? "");
    setEditFormError(null);
  };

  const cancelEditing = () => {
    setEditingEntryId(null);
    setEditAmount("");
    setEditNote("");
    setEditFormError(null);
  };

  const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingEntryId) return;

    const amountValue = Number(editAmount);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setEditFormError("Amount must be greater than zero");
      return;
    }

    const sanitizedNote = editNote.trim() === "" ? null : editNote.trim();
    updateEntryMutation.mutate({ entryId: editingEntryId, amount: amountValue, note: sanitizedNote });
  };

  const handleDeleteEntry = (entryId: string) => {
    if (!window.confirm("Remove this progress entry?")) {
      return;
    }
    deleteEntryMutation.mutate(entryId);
  };

  return (
    <main className="bg-slate-950 text-slate-100 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/60">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-slate-500">Created by {challenge.creatorName}</p>
              <h1 className="text-4xl font-semibold text-white">{challenge.title}</h1>
              <p className="mt-2 text-slate-300">{challenge.description || "No description provided."}</p>
            </div>

            <div className="flex gap-2">
              <span className="rounded-full border border-indigo-400/40 px-4 py-1 text-sm font-medium text-indigo-200">
                {challenge.visibility}
              </span>
              <span className="rounded-full border border-emerald-400/40 px-4 py-1 text-sm font-medium text-emerald-200">
                {challenge.status}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Target" value={formatAmount(challenge.targetAmount, challenge.targetMetric)} />
            <StatCard
              label="Timeline"
              value={`${new Date(challenge.startDate).toLocaleDateString()} → ${new Date(challenge.endDate).toLocaleDateString()}`}
              align="start"
            />
            <StatCard label="Members" value={challenge.memberCount.toString()} />
            <StatCard label="Created" value={new Date(challenge.createdAt).toLocaleDateString()} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {challenge.isMember && membershipId ? (
              <button
                onClick={() => leaveMutation.mutate()}
                disabled={!canMutate || leaveMutation.isPending}
                className="rounded-full border border-red-500/60 px-6 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-60"
              >
                {leaveMutation.isPending ? "Leaving..." : "Leave challenge"}
              </button>
            ) : hasPendingMembership ? (
              <div className="flex flex-wrap items-center gap-3">
                {membershipId && (
                  <button
                    onClick={() => leaveMutation.mutate()}
                    disabled={!canMutate || leaveMutation.isPending}
                    className="rounded-full border border-yellow-400/60 px-6 py-2 text-sm font-semibold text-yellow-200 hover:bg-yellow-500/10 disabled:opacity-60"
                  >
                    {leaveMutation.isPending ? "Cancelling..." : "Cancel request"}
                  </button>
                )}
                <p className="text-sm text-yellow-200">Waiting for owner approval.</p>
              </div>
            ) : (
              <button
                onClick={() => joinMutation.mutate()}
                disabled={!canMutate || joinMutation.isPending}
                className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                {joinMutation.isPending ? "Joining..." : "Join challenge"}
              </button>
            )}

            {membershipStatus === "Rejected" && (
              <p className="text-sm text-red-300">Your last request was rejected. You can request again.</p>
            )}

            {!canMutate && <p className="text-sm text-slate-400">Log in to join and track progress.</p>}

            {(joinMutation.isError || leaveMutation.isError) && (
              <p className="text-sm text-red-400">
                {joinMutation.error?.message || leaveMutation.error?.message}
              </p>
            )}

            {membershipDecisionMutation.isError && (
              <p className="text-sm text-red-400">{membershipDecisionMutation.error?.message}</p>
            )}

            {isOwner && (
              <div className="flex flex-wrap gap-3">
                {challenge.status === "Open" && (
                  <button
                    onClick={() => startMutation.mutate()}
                    disabled={!canMutate || startMutation.isPending}
                    className="rounded-full border border-emerald-400/60 px-6 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/10 disabled:opacity-60"
                  >
                    {startMutation.isPending ? "Starting..." : "Start challenge"}
                  </button>
                )}

                {challenge.status === "Running" && (
                  <button
                    onClick={() => completeMutation.mutate()}
                    disabled={!canMutate || completeMutation.isPending}
                    className="rounded-full border border-sky-400/60 px-6 py-2 text-sm font-semibold text-sky-200 hover:bg-sky-500/10 disabled:opacity-60"
                  >
                    {completeMutation.isPending ? "Completing..." : "Complete challenge"}
                  </button>
                )}

                {(startMutation.isError || completeMutation.isError) && (
                  <p className="w-full text-sm text-red-400">
                    {startMutation.error?.message || completeMutation.error?.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-semibold mb-4">Today's Progress</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <StatCard label="Total" value={formatAmount(challenge.todaysProgress, challenge.targetMetric)} align="start" />
                <StatCard
                  label="My contribution"
                  value={
                    challenge.userProgressToday !== null
                      ? formatAmount(challenge.userProgressToday, challenge.targetMetric)
                      : "—"
                  }
                  align="start"
                />
              </div>

              {challenge.isMember && (
                <form
                  className="mt-6 space-y-4 rounded-xl border border-slate-800/80 bg-slate-950/40 p-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    logMutation.mutate();
                  }}
                >
                  <h3 className="text-lg font-semibold">Log progress</h3>
                  {challenge.maxEntriesPerDay ? (
                    <p className="text-xs text-slate-500">
                      You can submit up to {challenge.maxEntriesPerDay} entries per day.
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500">Unlimited entries per day.</p>
                  )}
                  <div className="grid gap-3 md:grid-cols-3">
                    <label className="text-sm">
                      Amount
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={progressAmount}
                        onChange={(e) => setProgressAmount(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
                      />
                    </label>
                    <label className="text-sm">
                      Note (optional)
                      <input
                        value={progressNote}
                        onChange={(e) => setProgressNote(e.target.value)}
                        maxLength={200}
                        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
                        placeholder="What did you accomplish?"
                      />
                    </label>
                    <label className="text-sm">
                      Logged at (optional)
                      <input
                        type="datetime-local"
                        value={progressLoggedAt}
                        max={new Date(challenge.endDate).toISOString().slice(0, 16)}
                        min={new Date(challenge.startDate).toISOString().slice(0, 16)}
                        onChange={(e) => setProgressLoggedAt(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
                      />
                      <span className="mt-1 block text-xs text-slate-500">Defaults to the current time.</span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={logMutation.isPending}
                    className="w-full rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
                  >
                    {logMutation.isPending ? "Logging..." : "Save progress"}
                  </button>
                  {logMutation.isError && <p className="text-sm text-red-400">{logMutation.error?.message}</p>}
                </form>
              )}

              {user?.token && (
                <div className="mt-6 space-y-4 rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">My recent logs</h3>
                    <p className="text-xs text-slate-500">Last 10 entries</p>
                  </div>

                  {challenge.recentEntries.length === 0 ? (
                    <p className="text-sm text-slate-500">You haven't logged any progress yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {challenge.recentEntries.map((entry) => {
                        const isEditing = editingEntryId === entry.entryId;
                        return (
                          <li key={entry.entryId} className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                            {isEditing ? (
                              <form className="space-y-3" onSubmit={handleEditSubmit}>
                                <div className="grid gap-3 md:grid-cols-2">
                                  <label className="text-sm">
                                    Amount
                                    <input
                                      type="number"
                                      step="0.1"
                                      min="0"
                                      value={editAmount}
                                      onChange={(e) => setEditAmount(e.target.value)}
                                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
                                    />
                                  </label>
                                  <label className="text-sm">
                                    Note
                                    <input
                                      value={editNote}
                                      onChange={(e) => setEditNote(e.target.value)}
                                      maxLength={200}
                                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
                                    />
                                  </label>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="submit"
                                    disabled={updateEntryMutation.isPending}
                                    className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
                                  >
                                    {updateEntryMutation.isPending ? "Saving..." : "Save changes"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelEditing}
                                    disabled={updateEntryMutation.isPending}
                                    className="rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-60"
                                  >
                                    Cancel
                                  </button>
                                </div>
                                {(editFormError || updateEntryMutation.isError) && (
                                  <p className="text-sm text-red-400">
                                    {editFormError || updateEntryMutation.error?.message}
                                  </p>
                                )}
                              </form>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-4">
                                  <p className="text-sm font-semibold text-white">
                                    {formatAmount(entry.amount, challenge.targetMetric)}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {new Date(entry.loggedAt).toLocaleString()}
                                  </p>
                                </div>
                                {entry.note && <p className="text-sm text-slate-300">{entry.note}</p>}
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => startEditingEntry(entry)}
                                    disabled={updateEntryMutation.isPending}
                                    className="rounded-full border border-sky-400/60 px-4 py-1 text-xs font-semibold text-sky-200 hover:bg-sky-500/10 disabled:opacity-60"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteEntry(entry.entryId)}
                                    disabled={deleteEntryMutation.isPending}
                                    className="rounded-full border border-red-500/60 px-4 py-1 text-xs font-semibold text-red-200 hover:bg-red-500/10 disabled:opacity-60"
                                  >
                                    {deleteEntryMutation.isPending ? "Deleting..." : "Delete"}
                                  </button>
                                </div>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {deleteEntryMutation.isError && !editingEntryId && (
                    <p className="text-sm text-red-400">{deleteEntryMutation.error?.message}</p>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-2xl font-semibold mb-4">Members ({challenge.memberCount})</h2>
              {challenge.members.length === 0 ? (
                <p className="text-sm text-slate-400">No members yet.</p>
              ) : (
                <ul className="space-y-3">
                  {challenge.members.map((member) => (
                    <li key={member.userId} className="flex items-center justify-between rounded-lg bg-slate-950/40 px-4 py-2">
                      <span className="font-medium text-slate-100">{member.displayName}</span>
                      <span className="text-xs text-slate-500">
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
              {challenge.leaderboard.length === 0 ? (
                <p className="text-sm text-slate-400">No progress logged yet.</p>
              ) : (
                <ol className="space-y-3">
                  {challenge.leaderboard.map((entry, index) => (
                    <li
                      key={entry.userId}
                      className="flex items-center justify-between rounded-lg bg-slate-950/40 px-4 py-2"
                    >
                      <div>
                        <p className="text-sm font-semibold">#{index + 1} {entry.displayName}</p>
                        <p className="text-xs text-slate-500">
                          {formatAmount(entry.totalAmount, challenge.targetMetric)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {isOwner && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Pending requests</h3>
                {challenge.pendingMemberships.length === 0 ? (
                  <p className="text-sm text-slate-500">No pending memberships.</p>
                ) : (
                  <ul className="space-y-3">
                    {challenge.pendingMemberships.map((pending) => (
                      <li
                        key={pending.membershipId}
                        className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-100">{pending.displayName}</p>
                            <p className="text-xs text-slate-500">
                              Requested {new Date(pending.requestedAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                membershipDecisionMutation.mutate({
                                  membershipId: pending.membershipId,
                                  status: "Active",
                                })
                              }
                              className="rounded-full border border-emerald-500/60 px-4 py-1 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/10 disabled:opacity-60"
                              disabled={membershipDecisionMutation.isPending}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                membershipDecisionMutation.mutate({
                                  membershipId: pending.membershipId,
                                  status: "Rejected",
                                })
                              }
                              className="rounded-full border border-red-500/60 px-4 py-1 text-xs font-semibold text-red-200 hover:bg-red-500/10 disabled:opacity-60"
                              disabled={membershipDecisionMutation.isPending}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

const StatCard = ({
  label,
  value,
  align = "center",
}: {
  label: string;
  value: string;
  align?: "start" | "center";
}) => (
  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p
      className={`text-2xl font-semibold text-white ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      {value}
    </p>
  </div>
);
