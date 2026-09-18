import React from "react";
import { Menu, Bell, LogOut, User as UserIcon } from "lucide-react";
import logoImage from "../../assets/icons/logo.svg";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/shared/lib/useAuth";
import { auth } from "@/app/providers/firebase";
import { signOut } from "firebase/auth";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-8 py-3.5 flex items-center justify-between shadow-xs font-poppins z-35">
      <div className="flex items-center gap-6">
        <button
          onClick={onToggleSidebar}
          className="text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          aria-label="Переключить меню"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link
          to="/"
          className="flex items-center gap-2.5 font-bold text-gray-900 tracking-tight hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <img
              src={logoImage}
              alt="logo"
              className="w-5 h-5 object-contain"
            />
          </div>
          <span className="text-base">HCare</span>
        </Link>
      </div>

      <div className="flex items-center gap-5">
        <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
            >
              <UserIcon className="w-4 h-4 text-gray-500" />
              <span className="hidden sm:inline">
                {user.email?.split("@")[0]}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-gray-200 hover:bg-red-50 hover:text-red-600 text-gray-600 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-500/20 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
