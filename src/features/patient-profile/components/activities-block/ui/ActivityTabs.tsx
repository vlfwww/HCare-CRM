import React from "react";
import type { ActivityType } from "../../../model/types";

interface ActivityTabsProps {
  activeTab: ActivityType;
  onChangeTab: (tab: ActivityType) => void;
}

const tabs: ActivityType[] = ["timeline", "tasks", "notes"];

export const ActivityTabs: React.FC<ActivityTabsProps> = ({
  activeTab,
  onChangeTab,
}) => {
  return (
    <div className="grid grid-cols-3 border-b border-gray-100 mb-6 text-sm text-center">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChangeTab(tab)}
          className={`pb-3 font-medium relative capitalize ${
            activeTab === tab
              ? "text-emerald-600 border-b-2 border-emerald-500 -mb-[1px]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
