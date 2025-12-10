import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { queryClient } from "@/shared/api/query-client";
import type { AppProviderProps } from "@/shared/types"; // Importing props type

// AppProvider component to wrap app with providers
export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <Suspense fallback={<div className="p-4">Loading app...</div>}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Suspense>
  );
};
