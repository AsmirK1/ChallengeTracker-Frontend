import { useState, type FormEvent } from "react";
import { Button } from "@/shared/components/ui/components/Button";
import { formatDate } from "@/shared/utils/date";
import { formatAmount } from "@/features/challenges/utils";
import type { UserProgressEntry } from "@/features/challenges/schemas";
import type { ChallengeRecentLogsProps } from "../schemas";

// Component to display and manage recent logs for a challenge
export const ChallengeRecentLogs = ({
  challenge,
  user,
  onUpdateEntry,
  onDeleteEntry,
  isUpdatePending,
}: ChallengeRecentLogsProps) => {
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editFormError, setEditFormError] = useState<string | null>(null);

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

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEntryId) return;

    const amountValue = Number(editAmount);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setEditFormError("Amount must be greater than zero");
      return;
    }

    const sanitizedNote = editNote.trim() === "" ? undefined : editNote.trim();

    try {
      await onUpdateEntry(editingEntryId, amountValue, sanitizedNote);
      cancelEditing();
    } catch (error) {
      // Error handling is done in parent via toast or global error,
      // but we might want to show it here.
      // For now, let's assume parent handles global error display.
    }
  };

  const handleDelete = (entryId: string) => {
    if (!window.confirm("Remove this progress entry?")) {
      return;
    }
    onDeleteEntry(entryId);
  };

  if (!user?.token) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-white">My Recent Logs</h2>
        <p className="text-xs text-slate-500">Last 10 entries</p>
      </div>

      {challenge.recentEntries.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-8 text-center">
          <p className="text-sm text-slate-500">
            You haven't logged any progress yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {challenge.recentEntries.map((entry: UserProgressEntry) => {
            const isEditing = editingEntryId === entry.entryId;
            return (
              <div
                key={entry.entryId}
                className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 hover:border-slate-700 transition-all"
              >
                {isEditing ? (
                  <form className="space-y-4" onSubmit={onSave}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-400">
                          Amount
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-400">
                          Note
                        </label>
                        <input
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                    {editFormError && (
                      <p className="text-xs text-red-400">{editFormError}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        variant="success"
                        size="sm"
                        isLoading={isUpdatePending}
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        onClick={cancelEditing}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-bold text-white">
                          {formatAmount(entry.amount, challenge.targetMetric)}
                        </p>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                          {formatDate(entry.loggedAt)}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-sm text-slate-400">{entry.note}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEditingEntry(entry)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </Button>
                      <Button
                        onClick={() => handleDelete(entry.entryId)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
