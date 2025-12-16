import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  clearUserFromStorage,
  getUserFromStorage,
  saveUserToStorage,
  type StoredUser,
} from "../../../shared/auth/userStorage";

type AuthContextValue = {
  user: StoredUser | null;
  isAuthenticated: boolean;
  login: (user: StoredUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<StoredUser | null>(() => getUserFromStorage());

  useEffect(() => {
    const handleStorage = () => setUser(getUserFromStorage());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = (nextUser: StoredUser) => {
    saveUserToStorage(nextUser);
    setUser(nextUser);
  };

  const logout = () => {
    clearUserFromStorage();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
