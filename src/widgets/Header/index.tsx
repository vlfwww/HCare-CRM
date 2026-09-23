import React from "react";
import { Menu, Bell, LogOut, User as UserIcon, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import logoImage from "../../assets/icons/logo.svg";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/shared/lib/useAuth";
import { auth } from "@/app/providers/firebase";
import { signOut } from "firebase/auth";
import { useNotifications } from "@/shared/lib/useNotifications";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, loading } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications(
    user?.uid,
  );
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const handleNotificationsToggle = () => {
    const willOpen = !isNotificationsOpen;
    setIsNotificationsOpen(willOpen);
    if (willOpen) {
      void markAllAsRead().catch((error) => {
        console.error("Error marking notifications as read:", error);
      });
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-3 sm:px-8 py-3.5 flex items-center justify-between shadow-xs font-manrope z-35">
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

      <div className="flex items-center gap-2 sm:gap-5">
        <div className="relative">
        <button
          onClick={handleNotificationsToggle}
          className="relative w-11 h-11 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          aria-label="Уведомления"
          aria-expanded={isNotificationsOpen}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 min-w-4 h-4 px-1 rounded-full bg-emerald-500 text-white text-[10px] leading-4 font-semibold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
        {isNotificationsOpen && user && (
          <div className="absolute right-0 top-11 z-50 w-[calc(100vw-1.5rem)] max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-800">Notifications</h2>
              <span className="text-xs text-gray-400">{notifications.length}</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-xs text-gray-400">
                  No notifications yet
                </p>
              ) : (
                notifications.map((notification) => {
                  const Icon =
                    notification.type === "success"
                      ? CheckCircle2
                      : notification.type === "warning"
                        ? AlertTriangle
                        : Info;
                  return (
                    <div
                      key={notification.id}
                      className="flex gap-3 border-b border-gray-50 px-4 py-3 last:border-0"
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800">{notification.title}</p>
                        <p className="mt-0.5 break-words text-xs text-gray-500">{notification.message}</p>
                        <p className="mt-1 text-[10px] text-gray-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
        </div>

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
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
