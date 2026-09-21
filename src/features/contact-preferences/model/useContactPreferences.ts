import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/providers/firebase";

export interface ContactPreferences {
  email: boolean;
  mail: boolean;
  mobile: boolean;
}

export const useContactPreferences = (userId: string) => {
  const [preferences, setPreferences] = useState<ContactPreferences>({
    email: true,
    mobile: true,
    mail: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchPreferences = async () => {
      try {
        setIsLoading(true);
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          if (data.contactPreferences) {
            setPreferences({
              email: data.contactPreferences.email ?? true,
              mobile: data.contactPreferences.mobile ?? true,
              mail: data.contactPreferences.mail ?? false,
            });
          }
        }
      } catch (error) {
        console.error("Error loading contact preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPreferences();
  }, [userId]);

  const updatePreference = async (
    key: keyof ContactPreferences,
    value: boolean,
  ) => {
    if (!userId) return;

    const updated = {
      ...preferences,
      [key]: value,
    };

    setPreferences(updated);

    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        contactPreferences: updated,
      });
    } catch (error) {
      console.error("Error updating contact preferences:", error);

      setPreferences(preferences);
      alert("Не удалось сохранить настройки. Попробуйте снова.");
    }
  };

  return {
    preferences,
    isLoading,
    updatePreference,
  };
};
