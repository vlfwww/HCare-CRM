import { useState, useMemo, useCallback } from "react";
import type { SurveyItem } from "../../patient-profile/model/types";
import { db } from "@/app/providers/firebase";
import { collection, addDoc, onSnapshot, query, getDocs } from "firebase/firestore";
import { useFirestoreRealtimeQuery } from "@/shared/lib/useFirestoreRealtimeQuery";

const DEFAULT_AVAILABLE_SURVEYS = [
  "Chest examination",
  "Blood Test (Complete Blood Count)",
  "Electrocardiogram (ECG)",
  "Ultrasound Diagnostics",
  "MRI Scan",
  "General Medical Checkup",
];

export const useSurveys = (userId: string, enabled = true) => {
  const [searchQuery, setSearchQuery] = useState("");
  const surveysQuery = useFirestoreRealtimeQuery<SurveyItem[]>({
    queryKey: ["surveys", userId],
    enabled: Boolean(userId && enabled),
    fetchInitialData: useCallback(async () => {
      const snapshot = await getDocs(collection(db, `users/${userId}/surveys`));
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<SurveyItem, "id">),
      }));
    }, [userId]),
    subscribe: useCallback((onData, onError) => {
      if (!userId) return () => undefined;
      return onSnapshot(
        query(collection(db, `users/${userId}/surveys`)),
        (snapshot) => onData(snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<SurveyItem, "id">),
        }))),
        onError,
      );
    }, [userId]),
  });
  const availableSurveysQuery = useFirestoreRealtimeQuery<string[]>({
    queryKey: ["available-surveys"],
    enabled,
    fetchInitialData: useCallback(async () => {
      const snapshot = await getDocs(collection(db, "availableSurveys"));
      const list = snapshot.docs
        .map((doc) => doc.data().title)
        .filter((title): title is string => typeof title === "string");
      return list.length > 0 ? list : DEFAULT_AVAILABLE_SURVEYS;
    }, []),
    subscribe: useCallback((onData, onError) => onSnapshot(
      collection(db, "availableSurveys"),
      (snapshot) => {
        const list = snapshot.docs
          .map((doc) => doc.data().title)
          .filter((title): title is string => typeof title === "string");
        onData(list.length > 0 ? list : DEFAULT_AVAILABLE_SURVEYS);
      },
      onError,
    ), []),
  });
  const surveys = surveysQuery.data ?? [];
  const availableSurveys = availableSurveysQuery.data ?? DEFAULT_AVAILABLE_SURVEYS;

  const addSurveyToDb = async (newSurveyData: Omit<SurveyItem, "id">) => {
    if (!userId) return;
    try {
      await addDoc(collection(db, `users/${userId}/surveys`), {
        ...newSurveyData,
        status: newSurveyData.status || "Pending",
        details: "",
      });
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
