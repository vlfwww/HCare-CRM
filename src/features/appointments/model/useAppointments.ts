import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { db } from "@/app/providers/firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import type { AppointmentItem } from "../../patient-profile/model/types";

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

  const addAppointmentMutation = useMutation({
    mutationFn: async (newAppointment: AppointmentItem) => {
      if (!userId) {
        throw new Error("A user ID is required to save an appointment.");
      }

      await setDoc(
        doc(db, "users", userId),
        { appointments: arrayUnion(newAppointment) },
        { merge: true },
      );
      return newAppointment;
    },
    onSuccess: (newAppointment) => {
      setAppointments((prev) => [newAppointment, ...prev]);
    },
    onError: (error) => {
      console.error("Error saving appointment to Firestore:", error);
      alert("Не удалось сохранить запись в базу данных.");
    },
  });

  return {
    appointments,
    setAppointments,
    addAppointmentToDb: addAppointmentMutation.mutateAsync,
    isSaving: addAppointmentMutation.isPending,
  };
};
