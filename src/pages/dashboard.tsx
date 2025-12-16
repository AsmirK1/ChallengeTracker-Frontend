import { useEffect, useState } from "react";

import {
  clearUserFromStorage,
  getUserFromStorage,
  saveUserToStorage,
  type StoredUser,
} from "../shared/auth/userStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export const DashboardPage = () => {
  const [user, setUser] = useState<StoredUser | null>(() => getUserFromStorage());
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleStorage = () => setUser(getUserFromStorage());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Session expired");
        }

        const data = await res.json();
        const nextUser: StoredUser = {
          id: typeof data.userId === "string" ? data.userId : String(data.userId),
          email: data.email,
          displayName: data.displayName ?? data.email,
          token: user.token,
        };
        saveUserToStorage(nextUser);
        setUser(nextUser);
      } catch (err) {
        console.error(err);
        setError("Session expired. Please log in again.");
        clearUserFromStorage();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.token]);

  if (!user) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 text-slate-100 px-4">
        <section className="w-full max-w-md rounded-xl border border-slate-700/60 bg-slate-900/80 p-6 text-center">
          <h1 className="text-2xl font-semibold mb-2">Welcome to ChallengeTracker</h1>
          <p className="text-sm text-slate-400">Please log in to see your dashboard.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 text-slate-100 px-4">
      <section className="w-full max-w-xl rounded-2xl border border-slate-700/60 bg-slate-900/80 p-8 shadow-xl shadow-slate-900/70">
        <h1 className="text-3xl font-semibold mb-4">Welcome back!</h1>
        {loading && <p className="text-sm text-slate-400 mb-2">Loading your profile...</p>}
        {error && <p className="text-sm text-red-400 mb-2">{error}</p>}
        <p className="text-lg text-slate-200">
          Hello <span className="font-semibold text-indigo-300">{user.displayName}</span>, get ready to track your next challenge.
        </p>
      </section>
    </main>
  );
};
