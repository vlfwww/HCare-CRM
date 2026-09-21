import { useState, useMemo, useEffect } from "react";
import type {
  ActivityItem,
  ActivityType,
} from "../../patient-profile/model/types";
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

export const useActivities = (userId: string) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActivityType>("timeline");
  const [searchQuery, setSearchQuery] = useState("");
  const [postText, setPostText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, `users/${userId}/activities`),
      orderBy("date", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: ActivityItem[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ActivityItem, "id">),
        }));
        setActivities(items);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching activities:", error);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

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

  const handleCreateActivity = async () => {
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

  return {
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
  };
};
