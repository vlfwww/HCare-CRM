import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { db } from "@/app/providers/firebase";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
  createdAt: string;
  read: boolean;
}

export const addUserNotification = async (
  userId: string,
  notification: Omit<NotificationItem, "id" | "createdAt" | "read">,
) => {
  if (!userId) {
    throw new Error("A user ID is required to save a notification.");
  }

  const item: NotificationItem = {
    ...notification,
    id: `notification-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };

  await setDoc(
    doc(db, "users", userId),
    { notifications: arrayUnion(item) },
    { merge: true },
  );
};
