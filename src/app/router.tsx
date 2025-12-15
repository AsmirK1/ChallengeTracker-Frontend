import { createBrowserRouter, Outlet } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { CreateChallengePage } from "@/pages/create-challenge";
import { ChallengeDetailPage } from "@/pages/challenge-detail";
import { DashboardPage } from "@/pages/dashboard";
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
  { path: "create", element: <CreateChallengePage /> },
      { path: "challenges/:id", element: <ChallengeDetailPage /> },
    ],
  },
]);
