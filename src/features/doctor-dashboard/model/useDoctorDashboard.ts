import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/providers/firebase";
import { useAuth } from "@/shared/lib/useAuth";

export interface AppointmentItem {
  id: string;
  speciality: string;
  startTime: string;
  status: string;
  patientId?: string;
  patientName?: string;
  doctorName?: string;
}

interface DoctorProfileData {
  id: string;
  name: string;
  avatarUrl: string;
  hospital: string;
  location: string;
  availableHours: string;
  appointments: AppointmentItem[];
}

export const useDoctorDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<DoctorProfileData | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctorData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      let foundDocId: string | null = null;
      let docData: any = null;

      const qRole = query(
        collection(db, "medical-staff"),
        where("role", "==", "Doctor"),
      );
      const roleSnap = await getDocs(qRole);

      if (!roleSnap.empty) {
        const targetDoc = roleSnap.docs[0];
        foundDocId = targetDoc.id;
        docData = targetDoc.data();
      } else {
        const directRef = doc(db, "medical-staff", user.uid);
        const directSnap = await getDoc(directRef);
        if (directSnap.exists()) {
          foundDocId = user.uid;
          docData = directSnap.data();
        }
      }

      const doctorName =
        docData?.name || docData?.fullName || user.displayName || "";

      const usersSnap = await getDocs(collection(db, "users"));
      const doctorAppointments: AppointmentItem[] = [];

      usersSnap.forEach((userDoc) => {
        const userData = userDoc.data();
        if (userData.appointments && Array.isArray(userData.appointments)) {
          userData.appointments.forEach((app: any) => {
            const isForThisDoctor =
              !app.doctorName ||
              app.doctorName.trim().toLowerCase() ===
                doctorName.trim().toLowerCase();

            if (isForThisDoctor) {
              doctorAppointments.push({
                ...app,
                patientId: userDoc.id,
                patientName: userData.fullName || "Patient",
              });
            }
          });
        }
      });

      if (docData && foundDocId) {
        setDocId(foundDocId);
        setData({
          id: foundDocId,
          name: doctorName || "Doctor",
          avatarUrl: docData.avatarUrl || "",
          hospital: docData.hospital || "Not specified",
          location: docData.location || "Not specified",
          availableHours: docData.availableHours || "Not specified",
          appointments: doctorAppointments,
        });
      } else {
        setError("Doctor profile not found in 'medical-staff'.");
      }
    } catch (err) {
      console.error("Error fetching doctor profile:", err);
      setError("Failed to load doctor profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointmentStatus = async (
    patientId: string,
    appointmentId: string,
    newStatus: string,
  ) => {
    try {
      const patientRef = doc(db, "users", patientId);
      const patientSnap = await getDoc(patientRef);

      if (patientSnap.exists()) {
        const patientData = patientSnap.data();
        const appointments = patientData.appointments || [];

        const updatedAppointments = appointments.map((app: any) =>
          app.id === appointmentId ? { ...app, status: newStatus } : app,
        );

        await updateDoc(patientRef, { appointments: updatedAppointments });

        await fetchDoctorData();
      }
    } catch (err) {
      console.error("Failed to update appointment status:", err);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      void fetchDoctorData();
    } else if (!authLoading && !user) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  return {
    userId: docId,
    data,
    isLoading: authLoading || isLoading,
    error,
    refreshData: fetchDoctorData,
    updateAppointmentStatus,
  };
};
