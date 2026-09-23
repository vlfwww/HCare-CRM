import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/providers/firebase";
import { useAuth } from "@/shared/lib/useAuth";

export interface PatientData {
  fullName: string;
  role: string;
  avatarUrl: string;
  contactInfo: {
    phone: string;
    homePhone: string;
    email: string;
    address: string;
  };
  personalInfo: {
    gender: string;
    birthDate: string;
    age: number;
    patientId: string;
    nationality: string;
    maritalStatus: string;
    emergencyContact: string;
  };
  insurance: {
    memberId: string;
    provider: string;
  };
  activities: Array<{
    id: string;
    title: string;
    prefix: string;
    actor: string;
    date: string;
    iconName: string;
  }>;
  appointments: Array<{
    id: string;
    startTime: string;
    speciality: string;
    status: string;
  }>;
  surveys: Array<{
    id: string;
    title: string;
    completedOn: string;
  }>;
  feedback: Array<{
    id: string;
    caseTitle: string;
    date: string;
    rating: number;
  }>;
  contactPreferences: {
    email: boolean;
    mobile: boolean;
    mail: boolean;
  };
  carePlans?: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

const fetchPatientDataFromFirebase = async (
  effectiveUserId: string,
): Promise<PatientData | null> => {
  if (!effectiveUserId) {
    throw new Error("No authenticated user found or target ID provided");
  }

  const docRef = doc(db, "users", effectiveUserId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as PatientData;
  }

  return null;
};

export const usePatientData = (targetUserId?: string) => {
  const { user, loading: authLoading } = useAuth();
  const effectiveUserId = targetUserId || user?.uid;

  const query = useQuery({
    queryKey: ["patient", effectiveUserId || "guest"],
    queryFn: () => fetchPatientDataFromFirebase(effectiveUserId || ""),
    enabled: !!effectiveUserId && !authLoading,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  };
};
