import { createBrowserRouter, Outlet } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { CreateChallengePage } from "@/pages/createchallenge";
import { ChallengeListPage } from "@/pages/challengelist";
import { ChallengeDetailPage } from "@/pages/challenge-detail";
import { DashboardPage } from "@/pages/dashboard";
import { LeaderboardPage } from "@/pages/leaderboard";
import Nav from "@/shared/components/layouts/Nav";
import Footer from "@/shared/components/layouts/Footer";


const RootLayout = () => (
  <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
    <Nav />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);


export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "login", element: <LoginPage /> },
  { path: "register", element: <RegisterPage /> },
  { path: "createchallenge", element: <CreateChallengePage/> },
  { path: "challengelist", element: <ChallengeListPage/> },
  { path: "leaderboard", element: <LeaderboardPage /> },
  { path: "create", element: <CreateChallengePage /> },
  { path: "challenges/:id", element: <ChallengeDetailPage /> },
    ],
  },
]);
