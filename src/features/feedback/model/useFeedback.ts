import { useState, useEffect } from "react";
import { doc, getDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/app/providers/firebase";
import type { AppointmentItem } from "@/features/patient-profile/model/types";
import type { FeedbackItem, FeedbackFormState } from "./types";

export const calculateStars = (
  appointmentSat: number | null,
  doctorSat: number | null,
): string => {
  if (appointmentSat === null || doctorSat === null) return "☆☆☆☆☆";
  const average10 = (appointmentSat + doctorSat) / 2;
  const starsCount = Math.round((average10 / 10) * 5);
  const clamped = Math.max(0, Math.min(5, starsCount));
  return "★".repeat(clamped) + "☆".repeat(5 - clamped);
};

export const useFeedback = (userId: string, enabled = true) => {
  const [completedAppointments, setCompletedAppointments] = useState<
    AppointmentItem[]
  >([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formState, setFormState] = useState<FeedbackFormState>({
    appointmentId: "",
    appointmentSatisfaction: null,
    doctorSatisfaction: null,
  });

  useEffect(() => {
    if (!userId || !enabled) {
      setIsLoading(false);
      return;
    }

    const fetchFeedbackData = async () => {
      try {
        setIsLoading(true);

        const feedbacksRef = collection(db, `users/${userId}/feedbacks`);
        const feedbackSnapshot = await getDocs(feedbacksRef);
        const feedbackList = feedbackSnapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        })) as FeedbackItem[];
        setFeedbacks(feedbackList);

        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const appsList = (userData.appointments || []) as AppointmentItem[];
          setCompletedAppointments(appsList);

          const alreadyReviewedIds = new Set(
            feedbackList.map((f) => f.appointmentId),
          );
          const availableToReview = appsList.filter(
            (a) => a.status === "Completed" && !alreadyReviewedIds.has(a.id),
          );

          if (availableToReview.length > 0) {
            setFormState((prev) => ({
              ...prev,
              appointmentId: availableToReview[0].id,
            }));
          }
        }
      } catch (error) {
        console.error("Error loading feedback data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchFeedbackData();
  }, [userId, enabled]);

  const handleSaveFeedback = async () => {
    setErrorMessage(null);

    if (!formState.appointmentId) {
      setErrorMessage("Please select a completed appointment.");
      return false;
    }

    if (
      formState.appointmentSatisfaction === null ||
      formState.doctorSatisfaction === null
    ) {
      setErrorMessage("Please provide ratings for both questions.");
      return false;
    }

    if (!userId) return false;

    const targetAppointment = completedAppointments.find(
      (a) => a.id === formState.appointmentId,
    );
    if (!targetAppointment) return false;

    const stars = calculateStars(
      formState.appointmentSatisfaction,
      formState.doctorSatisfaction,
    );

    const newFeedbackData = {
      appointmentId: targetAppointment.id,
      doctorName: targetAppointment.doctorName || "Unknown Doctor",
      date:
        targetAppointment.date ||
        targetAppointment.startTime ||
        new Date().toLocaleDateString(),
      appointmentSatisfaction: formState.appointmentSatisfaction,
      doctorSatisfaction: formState.doctorSatisfaction,
      ratingStars: stars,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(
        collection(db, `users/${userId}/feedbacks`),
        newFeedbackData,
      );

      const savedFeedback: FeedbackItem = {
        id: docRef.id,
        ...newFeedbackData,
      };

      setFeedbacks((prev) => [savedFeedback, ...prev]);
      return true;
    } catch (error) {
      console.error("Error saving feedback to DB:", error);
      setErrorMessage("Failed to save feedback. Try again.");
      return false;
    }
  };

  return {
    completedAppointments,
    feedbacks,
    isLoading,
    formState,
    setFormState,
    errorMessage,
    handleSaveFeedback,
  };
};
