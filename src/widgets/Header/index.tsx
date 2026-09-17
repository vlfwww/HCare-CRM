import React from "react";
import { Menu, Bell } from "lucide-react";
import logoImage from "../../assets/icons/logo.svg";
import { Link } from "@tanstack/react-router";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="w-full bg-white border-b border-gray-200 px-8 py-3.5 flex items-center justify-between shadow-xs font-poppins z-30">
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
            <img src={logoImage} alt="logo" />
          </div>
          <span className="text-base">HCare</span>
        </Link>
      </div>

      <div className="flex items-center gap-5">
        <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center pl-2">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 border border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
