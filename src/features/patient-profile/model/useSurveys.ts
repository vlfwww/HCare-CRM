import { useState, useEffect, useMemo } from "react";
import type { SurveyItem } from "./types";
import { db } from "@/app/providers/firebase";
import { collection, addDoc, onSnapshot, query } from "firebase/firestore";

const DEFAULT_AVAILABLE_SURVEYS = [
  "Chest examination",
  "Blood Test (Complete Blood Count)",
  "Electrocardiogram (ECG)",
  "Ultrasound Diagnostics",
  "MRI Scan",
  "General Medical Checkup",
];

export const useSurveys = (userId: string) => {
  const [surveys, setSurveys] = useState<SurveyItem[]>([]);
  const [availableSurveys, setAvailableSurveys] = useState<string[]>(
    DEFAULT_AVAILABLE_SURVEYS,
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, `users/${userId}/surveys`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: SurveyItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<SurveyItem, "id">),
      }));
      setSurveys(items);
    });

    const surveysListRef = collection(db, "availableSurveys");
    const unsubscribeList = onSnapshot(surveysListRef, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((doc) => doc.data().title as string);
        if (list.length > 0) {
          setAvailableSurveys(list);
        }
      }
    });

    return () => {
      unsubscribe();
      unsubscribeList();
    };
  }, [userId]);

  const addSurveyToDb = async (newSurveyData: Omit<SurveyItem, "id">) => {
    if (!userId) return;
    try {
      await addDoc(collection(db, `users/${userId}/surveys`), newSurveyData);
    } catch (error) {
      console.error("Error adding survey to Firestore:", error);
    }
  };

  const filteredSurveys = useMemo(() => {
    return surveys.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.details &&
          item.details.toLowerCase().includes(searchQuery.toLowerCase())),
    );
  }, [surveys, searchQuery]);

  return {
    surveys,
    filteredSurveys,
    availableSurveys,
    searchQuery,
    setSearchQuery,
    addSurveyToDb,
  };
};
