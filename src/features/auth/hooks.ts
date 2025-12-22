import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { getCurrentUser } from "./api";
import { AuthContext } from "./components/AuthProvider";
import { queryKeys } from "@/shared/api/query-client";

// Custom hook to access authentication context
export const useAuth = () => {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Custom hook to fetch the current authenticated user
export function useCurrentUser() {
  const { isAuthenticated } = useAuth();

  // Fetches current user data if authenticated
  return useQuery({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}
