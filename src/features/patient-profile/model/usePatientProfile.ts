import { useState } from "react";
import { auth } from "@/app/providers/firebase";
import { usePatientData } from "@/entities/patient/model/usePatientData";
import { useAppointments } from "../../appointments/model/useAppointments";
import { useSurveys } from "../../surveys/model/useSurveys";
import { useFeedback } from "@/features/feedback/model/useFeedback";
import type { AppointmentItem } from "../model/types";

const calculateAge = (birthDateStr: string): number => {
  if (!birthDateStr) return 0;
  const parts = birthDateStr.split("/");
  if (parts.length !== 3) return 0;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const birthDate = new Date(year, month, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() - birthDate.getDate() < 0)) {
    age--;
  }
  return age >= 0 ? age : 0;
};

const getInitialsSvg = (name: string) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="100%" height="100%" fill="%23059669"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="white" font-family="sans-serif" font-size="50" font-weight="bold">${initials}</text></svg>`;
};

export const usePatientProfile = () => {
  const { data, isLoading, error } = usePatientData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId = auth.currentUser?.uid || "";

  const initialAppointments: AppointmentItem[] = (data?.appointments ||
    []) as unknown as AppointmentItem[];

  const { appointments, addAppointmentToDb } = useAppointments(
    userId,
    initialAppointments,
  );

  const { surveys, availableSurveys, addSurveyToDb } = useSurveys(userId);
  const { feedbacks } = useFeedback(userId);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const fullNameValue =
    data?.fullName || auth.currentUser?.displayName || "New Patient";

  const rawProfileData = data || {
    fullName: fullNameValue,
    role: "Patient",
    avatarUrl: getInitialsSvg(fullNameValue),
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
  };

  const profileData = {
    ...rawProfileData,
    appointments,
    surveys,
    personalInfo: {
      ...rawProfileData.personalInfo,
      age: calculateAge(rawProfileData.personalInfo?.birthDate),
    },
  };

  if (profileData && !profileData.avatarUrl) {
    profileData.avatarUrl = getInitialsSvg(profileData.fullName || "User");
  }

  return {
    userId,
    data,
    isLoading,
    error,
    isModalOpen,
    profileData,
    availableSurveys,
    feedbacks,
    handleOpenModal,
    handleCloseModal,
    addAppointmentToDb,
    addSurveyToDb,
  };
};
