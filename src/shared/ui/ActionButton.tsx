import React from "react";
import { Plus, type LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon = Plus,
  onClick,
  className = "",
  ariaLabel = "Open action",
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label={ariaLabel}
      className={`w-9 h-9 rounded-xl border border-gray-200 text-emerald-500 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-300 transition-colors bg-white ${className}`}
    >
      <Icon className="w-4 h-4 text-emerald-500" />
    </button>
  );
};
