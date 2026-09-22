import { useState, useEffect } from "react";
import { auth, db } from "@/app/providers/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { usePatientData } from "@/entities/patient/model/usePatientData";
import { useAppointments } from "../../appointments/model/useAppointments";
import { useSurveys } from "../../surveys/model/useSurveys";
import { useFeedback } from "@/features/feedback/model/useFeedback";
import type { AppointmentItem } from "../model/types";
import { useAuth } from "@/shared/lib/useAuth";

interface CarePlanItem {
  title: string;
  description: string;
  createdAt?: string;
}

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

  const [carePlans, setCarePlans] = useState<CarePlanItem[]>([]);

  useEffect(() => {
    if (data?.carePlans) {
      setCarePlans(data.carePlans);
    }
  }, [data?.carePlans]);

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
    if (!userId) return;

    const newPlan: CarePlanItem = {
      title: carePlanData.title,
      description: carePlanData.description,
      createdAt: new Date().toISOString(),
    };

    setCarePlans((prev) => [...prev, newPlan]);

    try {
      const patientRef = doc(db, "users", userId);
      await updateDoc(patientRef, {
        carePlans: arrayUnion(newPlan),
      });
      console.log("Care plan successfully saved to database for user:", userId);
    } catch (err) {
      console.error("Failed to save care plan to database", err);
      if (data?.carePlans) {
        setCarePlans(data.carePlans);
      }
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const fullNameValue =
    data?.fullName || auth.currentUser?.displayName || "New Patient";

  const rawProfileData = data || {
    fullName: fullNameValue,
    role: "Patient",
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
    role: rawProfileData.role || "Patient",
    appointments,
    surveys,
    carePlans,
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
