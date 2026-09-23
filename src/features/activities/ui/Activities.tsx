import React, { useEffect } from "react";
import { Link2, Search, Plus, X } from "lucide-react";
import { ActionButton } from "../../../shared/ui/ActionButton";
import { useActivities } from "../model/useActivities";
import { ActivityItemRow } from "./ActivityItemRow";
import { ActivityTabs } from "./ActivityTabs";

interface ActivitiesProps {
  userId: string;
}

export const Activities: React.FC<ActivitiesProps> = ({ userId }) => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    postText,
    setPostText,
    filteredActivities,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    handleCreateActivity,
    handleToggleTask,
  } = useActivities(userId);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm font-manrope overflow-hidden relative">
      <div className="flex items-center justify-between px-6 py-5">
        <p className="text-lg font-semibold text-gray-800">Activities</p>
        <div
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer focus:outline-none bg-transparent border-none p-0"
        >
          <ActionButton icon={Plus} ariaLabel="Add activity" />
        </div>
      </div>

      <div className="border-t border-gray-100 px-6 pt-5">
        <div className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type to search ..."
            className="w-full bg-transparent border-b border-gray-200 rounded-none px-0 pb-2 text-sm text-gray-700 focus:outline-none focus:border-emerald-500 pr-8"
          />
          <button
            type="button"
            className="absolute right-0 top-1 text-gray-400 hover:text-gray-600"
            aria-label="Search activities"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        <ActivityTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        <div className="space-y-5 pb-6">
          {isLoading ? (
            <p className="text-xs text-gray-400 text-center py-4">Loading...</p>
          ) : filteredActivities.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              No activities found
            </p>
          ) : (
            filteredActivities.map((item) => (
              <ActivityItemRow
                key={item.id}
                item={item}
                onToggleTask={handleToggleTask}
              />
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 capitalize">
                Add New {activeTab}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label="Close activity form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="relative mb-6">
                <input
                  type="text"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleCreateActivity();
                    }
                  }}
                  placeholder={
                    activeTab === "tasks"
                      ? "Type a new task..."
                      : activeTab === "notes"
                        ? "Type a new note..."
                        : "Type a post ..."
                  }
                  autoFocus
                  className="w-full bg-transparent border-b border-gray-200 rounded-none px-0 pb-2 text-sm text-gray-700 focus:outline-none focus:border-emerald-500 pr-8"
                />
                <button
                  type="button"
                  className="absolute right-0 top-1 text-gray-400 hover:text-gray-600"
                  aria-label="Add link"
                >
                  <Link2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleCreateActivity()}
                  disabled={!postText.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50 cursor-pointer"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
