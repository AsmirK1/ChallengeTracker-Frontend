import { createContext, useSyncExternalStore, type ReactNode } from "react";
import {
  clearUserFromStorage,
  getUserFromStorage,
  saveUserToStorage,
  subscribeToAuthChanges,
  type StoredUser,
} from "../../../shared/auth/userStorage";

// Authentication context value type
type AuthContextValue = {
  user: StoredUser | null;
  isAuthenticated: boolean;
  login: (user: StoredUser) => void;
  logout: () => void;
};

// Authentication context
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

// Authentication provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const user = useSyncExternalStore(subscribeToAuthChanges, getUserFromStorage);

  // Login function to save user
  const login = (nextUser: StoredUser) => {
    saveUserToStorage(nextUser);
  };

  // Logout function to clear user
  const logout = () => {
    clearUserFromStorage();
  };

  // Context value
  const value: AuthContextValue = {
    user, // current user
    isAuthenticated: Boolean(user), // authentication status
    login, // login function
    logout, // logout function
  };

  // Provide context to children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
