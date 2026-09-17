import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, User, Users, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const isProfile =
    location.pathname === "/" || location.pathname === "/profile";
  const isStaff = location.pathname === "/medical-staff";
  const isFeedback = location.pathname === "/feedback";

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
            Navigation
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
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
                isProfile
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <User className="w-5 h-5" />
              <span>Patient profile</span>
            </Link>

            <Link
              to="/medical-staff"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isStaff
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Medical Staff</span>
            </Link>

            <Link
              to="/feedback"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isFeedback
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Feedback</span>
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
};
