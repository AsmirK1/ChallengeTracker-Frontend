import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense, type ReactNode } from "react";
import { AuthProvider } from "@/features/auth";
import { queryClient } from "@/shared/api/query-client";

type AppProviderProps = {
  children: ReactNode;
};

// Wraps application with necessary providers
export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    // Suspense for lazy loaded components
    // QueryClientProvider for React Query
    // AuthProvider for authentication context
    <Suspense fallback={<div className="p-4">Loading app...</div>}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </Suspense>
  );
};
