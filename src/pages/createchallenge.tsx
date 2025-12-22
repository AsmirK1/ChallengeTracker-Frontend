import { CreateChallengeForm } from "@/features/challenges";

export const CreateChallengePage = () => {
  return (
    <main className="bg-transparent text-slate-100 px-4 py-15">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-white">
            Create New Challenge
          </h1>
          <p className="text-slate-400">
            Set up a new challenge to track your progress and compete with
            friends.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 md:p-8">
          <CreateChallengeForm />
        </section>
      </div>
    </main>
  );
};
