import { useCallback } from "react";
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { useFirestoreRealtimeQuery } from "./useFirestoreRealtimeQuery";
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
  const notificationsQuery = useFirestoreRealtimeQuery<NotificationItem[]>({
    queryKey: ["notifications", userId],
    enabled: Boolean(userId),
    fetchInitialData: useCallback(async () => {
      const snapshot = await getDoc(doc(db, "users", userId ?? ""));
      const values = snapshot.data()?.notifications;
      return (Array.isArray(values) ? values.filter(isNotification) : [])
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }, [userId]),
    subscribe: useCallback((onData, onError) => {
      if (!userId) return () => undefined;
      return onSnapshot(
        doc(db, "users", userId),
        (snapshot) => {
          const values = snapshot.data()?.notifications;
          onData((Array.isArray(values) ? values.filter(isNotification) : [])
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
        },
        onError,
      );
    }, [userId]),
  });
  const notifications = notificationsQuery.data ?? [];

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
    error: notificationsQuery.error,
  };
};
