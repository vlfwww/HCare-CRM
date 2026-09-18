import React, { useState } from "react";
import {
  Link2,
  Mail,
  Calendar,
  PhoneCall,
  User,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { ActionButton } from "../../../shared/ui/ActionButton";

interface ActivityItem {
  id: string;
  title: string;
  prefix: string;
  actor: string;
  date: string;
  iconName?: string;
}

interface ActivitiesProps {
  activities?: ActivityItem[];
}

const iconMap: Record<string, any> = {
  Mail,
  Calendar,
  PhoneCall,
  User,
  CheckCircle2,
};

export const Activities: React.FC<ActivitiesProps> = ({ activities = [] }) => {
  const [activeTab, setActiveTab] = useState<"timeline" | "tasks" | "notes">(
    "timeline",
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm font-manrope overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5">
        <p className="text-lg font-semibold text-gray-800">Activities</p>
        <ActionButton icon={Plus} />
      </div>

      <div className="border-t border-gray-100 px-6 pt-5">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Type a post ..."
            className="w-full bg-transparent border-b border-gray-200 rounded-none px-0 pb-2 text-sm text-gray-700 focus:outline-none focus:border-emerald-500"
          />
          <button className="absolute right-0 top-1 text-gray-400 hover:text-gray-600">
            <Link2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 border-b border-gray-100 mb-6 text-sm text-center">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`pb-3 font-medium relative ${
              activeTab === "timeline"
                ? "text-emerald-600 border-b-2 border-emerald-500 -mb-[1px]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`pb-3 font-medium relative ${
              activeTab === "tasks"
                ? "text-emerald-600 border-b-2 border-emerald-500 -mb-[1px]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`pb-3 font-medium relative ${
              activeTab === "notes"
                ? "text-emerald-600 border-b-2 border-emerald-500 -mb-[1px]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Notes
          </button>
        </div>

        <div className="space-y-5 pb-6">
          {activities.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              No recent activities
            </p>
          ) : (
            activities.map((item) => {
              const IconComponent = iconMap[item.iconName || "User"] || User;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex items-center justify-center text-gray-400 flex-shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.prefix}
                        <span className="text-emerald-600">{item.actor}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
