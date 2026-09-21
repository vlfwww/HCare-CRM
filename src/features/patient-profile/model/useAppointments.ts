import { useState, useEffect } from "react";
import { db } from "@/app/providers/firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import type { AppointmentItem } from "./types";

export const useAppointments = (
  userId: string,
  initialAppointments: AppointmentItem[] = [],
) => {
  const [appointments, setAppointments] =
    useState<AppointmentItem[]>(initialAppointments);

  useEffect(() => {
    if (initialAppointments && initialAppointments.length > 0) {
      setAppointments(initialAppointments);
    }
  }, [initialAppointments]);

  const addAppointmentToDb = async (newAppointment: AppointmentItem) => {
    if (!userId) return;

    try {
      const userDocRef = doc(db, "users", userId);

      await setDoc(
        userDocRef,
        {
          appointments: arrayUnion(newAppointment),
        },
        { merge: true },
      );

      setAppointments((prev) => [newAppointment, ...prev]);
    } catch (error) {
      console.error("Error saving appointment to Firestore:", error);
      alert("Не удалось сохранить запись в базу данных.");
    }
  };

  return {
    appointments,
    setAppointments,
    addAppointmentToDb,
  };
};
