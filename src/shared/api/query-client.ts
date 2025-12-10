import { QueryClient } from "@tanstack/react-query";

// Might need to be revisited later for more advanced setup

// Creates QueryClient instance with default options
export const queryClient = new QueryClient({
  // Sets query defaults
  defaultOptions: {
    queries: {
      retry: false, // Do not retry failed requests
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    },
  },
});
