import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/providers/firebase";

export interface PatientUser {
  id: string;
  fullName: string;
  email?: string;
  role: string;
  personalInfo?: {
    birthDate?: string;
    gender?: string;
    age?: number;
  };
  avatarUrl?: string;
}

const fetchPatients = async (): Promise<PatientUser[]> => {
  const [usersSnapshot, staffSnapshot] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(collection(db, "medical-staff")),
  ]);
  const doctorIds = new Set(
    staffSnapshot.docs
      .filter((docSnap) => {
        const role = docSnap.data().role;
        return (
          typeof role === "string" && role.trim().toLowerCase() === "doctor"
        );
      })
      .map((docSnap) => docSnap.id),
  );

  return usersSnapshot.docs.filter((docSnap) => {
    const role = docSnap.data().role;
    return (
      !doctorIds.has(docSnap.id) &&
      typeof role === "string" &&
      role.trim().toLowerCase() === "patient"
    );
  }).map((docSnap) => {
    const data = docSnap.data();
    const contactInfo =
      typeof data.contactInfo === "object" && data.contactInfo !== null
        ? data.contactInfo
        : {};

    return {
      id: docSnap.id,
      fullName:
        typeof data.fullName === "string" ? data.fullName : "Unnamed Patient",
      email:
        typeof contactInfo.email === "string"
          ? contactInfo.email
          : typeof data.email === "string"
            ? data.email
            : undefined,
      role: typeof data.role === "string" ? data.role : "Patient",
      personalInfo:
        typeof data.personalInfo === "object" && data.personalInfo !== null
          ? data.personalInfo
          : undefined,
      avatarUrl: typeof data.avatarUrl === "string" ? data.avatarUrl : "",
    };
  });
};

export const usePatientList = () => {
  const queryResult = useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });

  return {
    patients: queryResult.data ?? [],
    isLoading: queryResult.isLoading,
    error: queryResult.error instanceof Error ? queryResult.error.message : null,
  };
};
