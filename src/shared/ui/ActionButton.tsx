import React from "react";
import { Plus, type LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon = Plus,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 rounded-xl border border-gray-200 text-emerald-500 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-300 transition-colors bg-white ${className}`}
    >
      <Icon className="w-4 h-4 text-emerald-500" />
    </button>
  );
};
