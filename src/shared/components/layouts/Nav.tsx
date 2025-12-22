import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks";
import { Button } from "../ui/components/Button";
import logo from "@/assets/logo.png";

// Navigation bar component
const Nav = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Handle user logout
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur-md border-b border-slate-800">
      <nav className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-slate-100 hover:text-white transition-colors"
          >
            <img src={logo} alt="Logo" className="h-8 w-auto rounded-4xl" />
          </Link>

          <div className="flex items-center space-x-4 sm:space-x-6">
            {user && (
              <Link
                to="/createchallenge"
                className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base"
              >
                Create Challenge
              </Link>
            )}
            <Link
              to="/challengelist"
              className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base"
            >
              Browse Challenge
            </Link>

            {user ? (
              <div className="relative" data-dropdown>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 hover:border-slate-500 hover:bg-slate-900 transition-all text-slate-300 hover:text-white font-semibold"
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  {(user.displayName || user.email).charAt(0).toUpperCase()}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 py-2 z-50 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/30">
                      <p className="text-sm font-semibold text-white">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <div className="p-1.5">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white rounded-xl transition-colors"
                      >
                        Dashboard
                      </Link>

                      <div className="border-t border-slate-800 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/register"
                  className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Register
                </Link>

                <Link to="/login">
                  <Button size="sm">Login</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
