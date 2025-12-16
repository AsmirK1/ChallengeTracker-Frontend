import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  clearUserFromStorage,
  getUserFromStorage,
  type StoredUser,
} from "../../auth/userStorage";

const Nav = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<StoredUser | null>(() => getUserFromStorage());

  useEffect(() => {
    const handleStorage = () => setUser(getUserFromStorage());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    clearUserFromStorage();
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-500/30">
      <nav className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl font-bold text-slate-100 hover:text-white transition-colors"
          >
            ChallengeTracker
          </Link>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link 
              to="/" 
              className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base"
            >
              Home
            </Link>
            
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-slate-300">
                  Hi, <span className="font-semibold text-white">{user.displayName}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Register
                </Link>

                <Link 
                  to="/login" 
                  className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Nav;