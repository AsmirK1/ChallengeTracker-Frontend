import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import Nav from "@/shared/components/layouts/Nav";
import Footer from "@/shared/components/layouts/Footer";
import { ErrorBoundary } from "@/shared/components/ui/components/ErrorBoundary";
import {
  SkeletonDashboard,
  SkeletonChallengeDetail,
  SkeletonList,
} from "@/shared/components/ui/components/Skeleton";
import { getUserFromStorage } from "@/shared/auth/userStorage";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { CreateChallengePage } from "@/pages/createchallenge";
import { HomePage } from "@/pages/home";
import { ErrorPage } from "@/pages/error-page";

// Lazy loaded pages for code splitting
const DashboardPage = lazy(() =>
  import("@/pages/dashboard").then((m) => ({ default: m.DashboardPage }))
);

// Lazy loaded pages for code splitting
const ChallengeListPage = lazy(() =>
  import("@/pages/challengelist").then((m) => ({
    default: m.ChallengeListPage,
  }))
);

// Lazy loaded pages for code splitting
const ChallengeDetailPage = lazy(() =>
  import("@/pages/challenge-detail").then((m) => ({
    default: m.ChallengeDetailPage,
  }))
);

// Route wrapper to restrict access to guest users only
const GuestOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getUserFromStorage();
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

// Route wrapper to restrict access to authenticated users only
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getUserFromStorage();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Root layout component with navigation, footer and error boundary
const RootLayout = () => (
  <div className="min-h-screen flex flex-col bg-transparent text-slate-100">
    <Nav />
    <main className="flex-1">
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </main>
    <Footer />
  </div>
);

// Application router configuration
export const router = createBrowserRouter([
  {
    path: "/", // Root path
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<SkeletonDashboard />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <GuestOnlyRoute>
            <LoginPage />
          </GuestOnlyRoute>
        ),
      },
      {
        path: "register",
        element: (
          <GuestOnlyRoute>
            <RegisterPage />
          </GuestOnlyRoute>
        ),
      },
      {
        path: "createchallenge",
        element: (
          <AuthRoute>
            <CreateChallengePage />
          </AuthRoute>
        ),
      },
      {
        path: "challengelist",
        element: (
          <Suspense fallback={<SkeletonList count={5} />}>
            <ChallengeListPage />
          </Suspense>
        ),
      },
      {
        path: "challenges/:id",
        element: (
          <Suspense fallback={<SkeletonChallengeDetail />}>
            <ChallengeDetailPage />
          </Suspense>
        ),
      },
    ],
  },
]);
