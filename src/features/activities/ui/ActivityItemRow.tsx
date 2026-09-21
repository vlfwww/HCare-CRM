import React from "react";
import {
  Mail,
  Calendar,
  PhoneCall,
  User,
  CheckCircle2,
  Check,
} from "lucide-react";
import type { ActivityItem } from "../../patient-profile/model/types";

const iconMap: Record<string, any> = {
  Mail,
  Calendar,
  PhoneCall,
  User,
  CheckCircle2,
};

interface ActivityItemRowProps {
  item: ActivityItem;
  onToggleTask?: (id: string, completed: boolean) => void;
}

export const ActivityItemRow: React.FC<ActivityItemRowProps> = ({
  item,
  onToggleTask,
}) => {
  const IconComponent = iconMap[item.iconName || "User"] || User;

  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        {item.type === "tasks" ? (
          <button
            onClick={() =>
              onToggleTask && onToggleTask(item.id, !item.completed)
            }
            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
              item.completed
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "border-gray-300 hover:border-emerald-500"
            }`}
          >
            {item.completed && <Check className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <div className="w-9 h-9 flex items-center justify-center text-gray-400 flex-shrink-0">
            <IconComponent className="w-5 h-5" />
          </div>
        )}

        <div>
          <p
            className={`text-sm font-semibold text-gray-800 ${item.completed ? "line-through text-gray-400" : ""}`}
          >
            {item.title}
          </p>
          <p className="text-xs text-gray-400">
            {item.prefix}
            <span className="text-emerald-600 ml-1">{item.actor}</span>
          </p>
        </div>
      </div>
      <span className="text-xs text-gray-400">{item.date}</span>
    </div>
  );
};
