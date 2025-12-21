import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/components/Button";

// Home page component
export const Home = () => {
  return (
    <main className="bg-transparent text-slate-100 px-4 py-15">
      <section className="w-full max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
            Track Your <span className="text-blue-500">Challenges</span>, <br />
            Achieve Your <span className="text-emerald-500">Goals</span>.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            The ultimate platform to create, join, and track personal or group
            challenges. Stay motivated with real-time progress tracking and
            competitive leaderboards.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/challengelist">
            <Button variant="primary" size="lg" className="px-10 py-4 text-lg">
              Browse Challenges
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg" className="px-10 py-4 text-lg">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <FeatureCard
            title="Real-time Tracking"
            description="Log your progress daily and see your stats update instantly."
            icon="📈"
          />
          <FeatureCard
            title="Leaderboards"
            description="Compete with friends and other members to reach the top."
            icon="🏆"
          />
          <FeatureCard
            title="Custom Challenges"
            description="Create your own challenges with custom metrics and goals."
            icon="🎯"
          />
        </div>
      </section>
    </main>
  );
};

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) => (
  <article className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 text-left space-y-3">
    <div className="text-3xl" role="img" aria-hidden="true">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </article>
);
