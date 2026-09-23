import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/app/providers/firebase";
import type { NotificationItem } from "./notifications";

const isNotification = (value: unknown): value is NotificationItem => {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<NotificationItem>;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.message === "string" &&
    typeof item.createdAt === "string"
  );
};

export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setError(null);
      return;
    }

    return onSnapshot(
      doc(db, "users", userId),
      (snapshot) => {
        const values = snapshot.data()?.notifications;
        const items = Array.isArray(values)
          ? values.filter(isNotification)
          : [];
        setNotifications(
          items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        );
        setError(null);
      },
      (snapshotError) => {
        console.error("Error fetching notifications:", snapshotError);
        setError(snapshotError);
      },
    );
  }, [userId]);

  const markAllAsRead = async () => {
    if (!userId || notifications.every((notification) => notification.read)) {
      return;
    }

    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
    await updateDoc(doc(db, "users", userId), {
      notifications: updatedNotifications,
    });
  };

  return {
    notifications,
    unreadCount: notifications.filter((notification) => !notification.read)
      .length,
    markAllAsRead,
    error,
  };
};
