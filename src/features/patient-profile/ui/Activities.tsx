import React, { useState, useMemo, useEffect } from "react";
import {
  Link2,
  Mail,
  Calendar,
  PhoneCall,
  User,
  CheckCircle2,
  Plus,
  Search,
  Check,
  X,
} from "lucide-react";
import { ActionButton } from "../../../shared/ui/ActionButton";
import type { ActivityItem, ActivityType } from "../model/types";
import { db } from "@/app/providers/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

interface ActivitiesProps {
  userId: string;
}

const iconMap: Record<string, any> = {
  Mail,
  Calendar,
  PhoneCall,
  User,
  CheckCircle2,
};

export const Activities: React.FC<ActivitiesProps> = ({ userId }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activeTab, setActiveTab] = useState<ActivityType>("timeline");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postText, setPostText] = useState("");

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, `users/${userId}/activities`),
      orderBy("date", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: ActivityItem[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<ActivityItem, "id">),
      }));
      setActivities(items);
    });

    return () => unsubscribe();
  }, [userId]);

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

  const handleCreateActivity = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!postText.trim() || !userId) return;

    const newActivityData: Omit<ActivityItem, "id"> = {
      type:
        activeTab === "tasks"
          ? "tasks"
          : activeTab === "notes"
            ? "notes"
            : "timeline",
      title: postText.trim(),
      prefix: "Added by ",
      actor: "patient",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      iconName: activeTab === "tasks" ? "CheckCircle2" : "User",
      completed: false,
    };

    try {
      await addDoc(
        collection(db, `users/${userId}/activities`),
        newActivityData,
      );
      setPostText("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding activity: ", error);
      alert("Не удалось сохранить запись. Попробуйте еще раз.");
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    if (!userId) return;
    try {
      const taskDocRef = doc(db, `users/${userId}/activities`, id);
      await updateDoc(taskDocRef, { completed });
    } catch (error) {
      console.error("Error updating task status: ", error);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm font-manrope overflow-hidden relative">
      <div className="flex items-center justify-between px-6 py-5">
        <p className="text-lg font-semibold text-gray-800">Activities</p>
        <div
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer focus:outline-none bg-transparent border-none p-0"
        >
          <ActionButton icon={Plus} />
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
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 border-b border-gray-100 mb-6 text-sm text-center">
          {(["timeline", "tasks", "notes"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
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

        <div className="space-y-5 pb-6">
          {filteredActivities.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              No activities found
            </p>
          ) : (
            filteredActivities.map((item) => {
              const IconComponent = iconMap[item.iconName || "User"] || User;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    {item.type === "tasks" ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleTask(item.id, !item.completed)
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
                        className={`text-sm font-semibold text-gray-800 ${
                          item.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.prefix}
                        <span className="text-emerald-600 ml-1">
                          {item.actor}
                        </span>
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
                      handleCreateActivity();
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
                  onClick={(e) => handleCreateActivity(e)}
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
