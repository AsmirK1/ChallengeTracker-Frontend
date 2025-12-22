import { useParams } from "react-router-dom";
import { ChallengeDetail } from "@/features/challenges";

export const ChallengeDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 text-slate-100 px-4">
        <section className="max-w-lg w-full rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-center">
          <h1 className="text-2xl font-semibold mb-2">Challenge not found</h1>
          <p className="text-slate-400 mb-4">Invalid challenge ID.</p>
        </section>
      </main>
    );
  }

  return <ChallengeDetail challengeId={id} />;
};
