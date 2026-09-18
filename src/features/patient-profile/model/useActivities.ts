import { useState, useMemo } from "react";
import type { ActivityItem, ActivityType } from "./types";

export const useActivities = (initialActivities: ActivityItem[] = []) => {
  const [activities, setActivities] =
    useState<ActivityItem[]>(initialActivities);
  const [activeTab, setActiveTab] = useState<ActivityType>("timeline");
  const [searchQuery, setSearchQuery] = useState("");
  const [postText, setPostText] = useState("");

  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      const matchesTab = item.type === activeTab;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.prefix.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [activities, activeTab, searchQuery]);

  const addLocalActivity = (newActivity: ActivityItem) => {
    setActivities((prev) => [newActivity, ...prev]);
  };

  const toggleLocalTask = (id: string, completed: boolean) => {
    setActivities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed } : item)),
    );
  };

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    postText,
    setPostText,
    filteredActivities,
    addLocalActivity,
    toggleLocalTask,
  };
};
