import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { db } from "@/app/providers/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  onSnapshot,
  query,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { usePatientData } from "@/entities/patient/model/usePatientData";
import { useAppointments } from "../../appointments/model/useAppointments";
import { useSurveys } from "../../surveys/model/useSurveys";
import { useFeedback } from "@/features/feedback/model/useFeedback";
import type { AppointmentItem } from "../model/types";
import { useAuth } from "@/shared/lib/useAuth";
import type { PghdItem } from "../ui/tabs/PghdTab";
import type { PrescriptionItem } from "../ui/tabs/PrescriptionsTab";
import { isPatientProfileComplete } from "@/shared/lib/profileCompletion";

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

export const usePatientProfile = (
  targetUserId?: string,
  activeTab: "summary" | "care-plan" | "lab-results" | "pghd" | "prescriptions" | "chat" = "summary",
) => {
  const queryClient = useQueryClient();
  const { user, isDoctor, loading: authLoading } = useAuth();
  const userId = targetUserId || user?.uid || "";

  const { data, isLoading: dataLoading, error } = usePatientData(targetUserId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [carePlans, setCarePlans] = useState<CarePlanItem[]>([]);
  const [pghdData, setPghdData] = useState<PghdItem[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);

  useEffect(() => {
    if (data?.carePlans) {
      setCarePlans(data.carePlans);
    }
  }, [data?.carePlans]);

  useEffect(() => {
    if (!userId || activeTab !== "pghd") return;

    const q = query(collection(db, `users/${userId}/pghd`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: PghdItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<PghdItem, "id">),
      }));
      setPghdData(items);
    });

    return () => unsubscribe();
  }, [userId, activeTab]);

  useEffect(() => {
    if (!userId || activeTab !== "prescriptions") return;

    const q = query(
      collection(db, `users/${userId}/prescriptions`),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: PrescriptionItem[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<PrescriptionItem, "id">),
        }));
        setPrescriptions(items);
      },
      (error) => {
        console.error("Error fetching prescriptions:", error);
      },
    );

    return () => unsubscribe();
  }, [userId, activeTab]);

  const initialAppointments: AppointmentItem[] = (data?.appointments ||
    []) as unknown as AppointmentItem[];

  const { appointments, addAppointmentToDb } = useAppointments(
    userId,
    initialAppointments,
  );

  const { surveys, availableSurveys, addSurveyToDb } = useSurveys(
    userId,
    activeTab === "summary" || activeTab === "lab-results",
  );
  const { feedbacks } = useFeedback(userId, activeTab === "summary");

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

  const addPrescriptionToDb = async (
    prescriptionData: Omit<PrescriptionItem, "id" | "createdAt">,
  ) => {
    if (!userId) return;

    try {
      await addDoc(collection(db, `users/${userId}/prescriptions`), {
        ...prescriptionData,
        createdAt: new Date().toISOString(),
      });
      console.log("Prescription successfully added to database");
    } catch (error) {
      console.error("Error adding prescription:", error);
      throw error;
    }
  };

  const updateSurveyResultInDb = async (
    surveyId: string,
    details: string,
    status?: string,
  ) => {
    if (!userId) return;

    try {
      const surveyRef = doc(db, "users", userId, "surveys", surveyId);
      await updateDoc(surveyRef, {
        details: details,
        status: status || "Completed",
        completedDate: new Date().toLocaleDateString(),
      });
      console.log(
        "Survey result successfully updated in database for survey:",
        surveyId,
      );
    } catch (err) {
      console.error("Failed to update survey result in database", err);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const updateAvatar = async (avatarUrl: string) => {
    if (!userId || isDoctor) return;
    await updateDoc(doc(db, "users", userId), { avatarUrl });
    await queryClient.invalidateQueries({ queryKey: ["patient", userId] });
  };

  const fullNameValue =
    data?.fullName || user?.displayName || "";

  const rawProfileData = data || {
    id: userId,
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
  } as typeof rawProfileData & {
    appointments: AppointmentItem[];
    surveys: typeof surveys;
    carePlans: CarePlanItem[];
  };
  const isProfileComplete = isPatientProfileComplete(profileData);

  return {
    userId,
    data,
    isLoading: dataLoading || authLoading,
    error,
    isModalOpen,
    profileData,
    isProfileComplete,
    updateAvatar,
    availableSurveys,
    feedbacks,
    isDoctor,
    pghdData,
    prescriptions,
    handleOpenModal,
    handleCloseModal,
    addAppointmentToDb,
    addSurveyToDb,
    addCarePlanToDb,
    updateSurveyResultInDb,
    addPrescriptionToDb,
  };
};
