import React from "react";
import { Link2 } from "lucide-react";
import type { ActivityType } from "../../patient-profile/model/types";

interface ActivityFormProps {
  activeTab: ActivityType;
  postText: string;
  setPostText: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  activeTab,
  postText,
  setPostText,
  onSubmit,
}) => {
  const placeholderText =
    activeTab === "tasks"
      ? "Type a new task..."
      : activeTab === "notes"
        ? "Type a new note..."
        : "Type a post ...";

  return (
    <form onSubmit={onSubmit} className="relative mb-4">
      <input
        type="text"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        placeholder={placeholderText}
        className="w-full bg-transparent border-b border-gray-200 rounded-none px-0 pb-2 text-sm text-gray-700 focus:outline-none focus:border-emerald-500 pr-16"
      />
      <div className="absolute right-0 top-1 flex items-center gap-2">
        <button type="button" className="text-gray-400 hover:text-gray-600">
          <Link2 className="w-4 h-4" />
        </button>
        {postText.trim() && (
          <button
            type="submit"
            className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold"
          >
            Post
          </button>
        )}
      </div>
    </form>
  );
};
