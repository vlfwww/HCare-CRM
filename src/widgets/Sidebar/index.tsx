import React, { useEffect } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { User, Users, MessageSquare, X, Home, Lock } from "lucide-react";
import { useAuth } from "@/shared/lib/useAuth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const { user, isDoctor, loading } = useAuth();

  const currentPath = routerState.location.pathname;

  const isHome = currentPath === "/";
  const isProfile = currentPath === "/profile";
  const isPatients =
    currentPath === "/patients" || currentPath.startsWith("/patients/");
  const isStaff = currentPath === "/medical-staff";
  const isFeedback = currentPath === "/feedback";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleProtectedClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      onClose();
      navigate({ to: "/login" });
    } else {
      onClose();
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-gray-200 z-50 flex flex-col font-manrope shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">
            Menu
          </span>
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-1.5">
            <Link
              to="/"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isHome
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            {user && isDoctor && (
              <Link
                to="/patients"
                onClick={(e) => handleProtectedClick(e)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isPatients
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span>Patients List</span>
                </div>
              </Link>
            )}

            <Link
              to="/profile"
              onClick={(e) => handleProtectedClick(e)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isProfile
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                <span>{isDoctor ? "My Dashboard" : "Patient Profile"}</span>
              </div>
              {!user && !loading && <Lock className="w-4 h-4 text-gray-400" />}
            </Link>

            {!isDoctor && (
              <Link
                to="/medical-staff"
                onClick={(e) => handleProtectedClick(e)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isStaff
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span>Medical Staff</span>
                </div>
                {!user && !loading && (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
              </Link>
            )}

            {!isDoctor && (
              <Link
                to="/feedback"
                onClick={(e) => handleProtectedClick(e)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isFeedback
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5" />
                  <span>Feedback</span>
                </div>
                {!user && !loading && (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
              </Link>
            )}
          </nav>
        </div>

        {!user && !loading && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 m-4 rounded-xl">
            <p className="text-xs text-gray-500 mb-3">
              Sign in to unlock full access to medical staff and clinic
              features.
            </p>
            <Link
              to="/login"
              onClick={onClose}
              className="block w-full py-2 text-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
            >
              Sign In
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};
