import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { CreateChallengePage } from "@/pages/create-challenge";
import { ChallengeDetailPage } from "@/pages/challenge-detail";
import { DashboardPage } from "@/pages/dashboard";

// Defines application routes (boilerplate needs to be done correctly)
export const router = createBrowserRouter([
  { path: "/", element: <DashboardPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/create", element: <CreateChallengePage /> },
  { path: "/challenges/:id", element: <ChallengeDetailPage /> },
]);
