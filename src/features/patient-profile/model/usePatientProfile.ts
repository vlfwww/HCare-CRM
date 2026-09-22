import { useState } from "react";
import { auth } from "@/app/providers/firebase";
import { usePatientData } from "@/entities/patient/model/usePatientData";
import { useAppointments } from "../../appointments/model/useAppointments";
import { useSurveys } from "../../surveys/model/useSurveys";
import { useFeedback } from "@/features/feedback/model/useFeedback";
import type { AppointmentItem } from "../model/types";
import { useAuth } from "@/shared/lib/useAuth";

function calculateAge(birthDateString?: string): number {
  if (!birthDateString) return 0;
  const parts = birthDateString.split("/");
  const birthDate =
    parts.length === 3
      ? new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
      : new Date(birthDateString);

  if (isNaN(birthDate.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export const usePatientProfile = (targetUserId?: string) => {
  const { isDoctor, loading: authLoading } = useAuth();
  const userId = targetUserId || auth.currentUser?.uid || "";

  const { data, isLoading: dataLoading, error } = usePatientData(targetUserId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialAppointments: AppointmentItem[] = (data?.appointments ||
    []) as unknown as AppointmentItem[];

  const { appointments, addAppointmentToDb } = useAppointments(
    userId,
    initialAppointments,
  );

  const { surveys, availableSurveys, addSurveyToDb } = useSurveys(userId);
  const { feedbacks } = useFeedback(userId);

  const addCarePlanToDb = async (carePlanData: {
    title: string;
    description: string;
  }) => {
    try {
      console.log("Saving care plan as Doctor for user:", userId, carePlanData);
    } catch (err) {
      console.error("Failed to save care plan", err);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const fullNameValue =
    data?.fullName || auth.currentUser?.displayName || "New Patient";

  const existingCarePlans = data?.carePlans || [];

  const rawProfileData = data || {
    fullName: fullNameValue,
    role: isDoctor ? "Doctor" : "Patient",
    avatarUrl: "",
    contactInfo: { phone: "", homePhone: "", address: "", email: "" },
    personalInfo: {
      gender: "",
      birthDate: "",
      age: 0,
      patientId: "",
      nationality: "",
      maritalStatus: "",
      emergencyContact: "",
    },
    insurance: { memberId: "", provider: "" },
    activities: [],
    carePlans: [],
  };

  const profileData = {
    ...rawProfileData,
    role: isDoctor ? "Doctor" : "Patient",
    appointments,
    surveys,
    carePlans: existingCarePlans,
    personalInfo: {
      ...rawProfileData.personalInfo,
      age: calculateAge(rawProfileData.personalInfo?.birthDate),
    },
  };

  return {
    userId,
    data,
    isLoading: dataLoading || authLoading,
    error,
    isModalOpen,
    profileData,
    availableSurveys,
    feedbacks,
    isDoctor,
    handleOpenModal,
    handleCloseModal,
    addAppointmentToDb,
    addSurveyToDb,
    addCarePlanToDb,
  };
};
