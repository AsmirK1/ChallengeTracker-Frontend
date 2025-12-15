import type { FormEvent } from "react";
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5295";

export const RegisterPage = () => {
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const data = new FormData(e.currentTarget);
		const email = data.get("email") as string;
		const password = data.get("password") as string;
		const confirmPassword = data.get("confirmPassword") as string;

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			setLoading(false);
			return;
		}

		try {
			const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) {
				const msg = await res.text();
				throw new Error(msg || "Registration failed.");
			}

			const payload = await res.json();
			const user = {
				id: payload.userId,
				email: payload.email,
				token: payload.token,
			};
			localStorage.setItem("ct_user", JSON.stringify(user));
			window.location.href = "/";
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Registration failed.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 text-slate-100 px-4">
			<section className="w-full max-w-md rounded-xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-xl shadow-slate-900/70">
				<h1 className="text-2xl font-semibold text-center mb-1">Create account</h1>
				<p className="text-sm text-slate-400 text-center mb-6">
					Join ChallengeTracker and start tracking your progress.
				</p>

				{error && <p className="mb-4 text-sm text-red-400">{error}</p>}

				<form className="space-y-4" onSubmit={handleSubmit}>
					<div className="space-y-1">
						<label className="block text-sm font-medium text-slate-200" htmlFor="email">
							Email
						</label>
						<input
							id="email"
							type="email"
							name="email"
							required
							className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
						/>
					</div>

					<div className="space-y-1">
						<label className="block text-sm font-medium text-slate-200" htmlFor="password">
							Password
						</label>
						<input
							id="password"
							type="password"
							name="password"
							required
							className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus-border-indigo-500 focus:ring-1 focus:ring-indigo-500"
						/>
					</div>

					<div className="space-y-1">
						<label className="block text-sm font-medium text-slate-200" htmlFor="confirmPassword">
							Confirm password
						</label>
						<input
							id="confirmPassword"
							type="password"
							name="confirmPassword"
							required
							className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="mt-2 w-full rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-60"
					>
						{loading ? "Creating account..." : "Create account"}
					</button>
				</form>
			</section>
		</main>
	);
};
