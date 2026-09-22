import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
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

export const usePatientList = () => {
  const [patients, setPatients] = useState<PatientUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const q = query(
          collection(db, "users"),
          where("role", "==", "Patient"),
        );
        const querySnapshot = await getDocs(q);

        const patientList: PatientUser[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          patientList.push({
            id: docSnap.id,
            fullName: data.fullName || "Unnamed Patient",
            email: data.contactInfo?.email || data.email,
            role: data.role,
            personalInfo: data.personalInfo,
            avatarUrl: data.avatarUrl || "",
          });
        });

        setPatients(patientList);
      } catch (err: any) {
        console.error("Error fetching patients:", err);
        setError(err.message || "Failed to load patients");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPatients();
  }, []);

  return { patients, isLoading, error };
};
