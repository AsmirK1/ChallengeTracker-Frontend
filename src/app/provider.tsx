import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { AuthProvider } from "@/features/auth";
import { queryClient } from "@/shared/api/query-client";
import type { AppProviderProps } from "@/shared/types"; 


export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <Suspense fallback={<div className="p-4">Loading app...</div>}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </Suspense>
  );
};
