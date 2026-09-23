import { useState, useEffect } from "react";
import {
  collection,
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
      let docData: Record<string, unknown> | null = null;

      const directRef = doc(db, "medical-staff", user.uid);
      const directSnap = await getDoc(directRef);
      if (
        directSnap.exists() &&
        directSnap.data().role?.toString().trim().toLowerCase() === "doctor"
      ) {
        foundDocId = user.uid;
        docData = directSnap.data() as Record<string, unknown>;
      }

      const doctorName =
        (typeof docData?.name === "string" ? docData.name : "") ||
        (typeof docData?.fullName === "string" ? docData.fullName : "") ||
        user.displayName ||
        "";

      const usersSnap = await getDocs(collection(db, "users"));
      const doctorAppointments: AppointmentItem[] = [];

      usersSnap.forEach((userDoc) => {
        const userData = userDoc.data();
        if (userData.appointments && Array.isArray(userData.appointments)) {
          userData.appointments.forEach((app: unknown) => {
            if (typeof app !== "object" || app === null) return;
            const appointment = app as Record<string, unknown>;
            const isForThisDoctor =
              appointment.doctorId === foundDocId ||
              (typeof appointment.doctorName === "string" &&
                appointment.doctorName.trim().toLowerCase() ===
                  doctorName.trim().toLowerCase());

            if (isForThisDoctor) {
              doctorAppointments.push({
                id: typeof appointment.id === "string" ? appointment.id : "",
                speciality:
                  typeof appointment.speciality === "string"
                    ? appointment.speciality
                    : "",
                startTime:
                  typeof appointment.startTime === "string"
                    ? appointment.startTime
                    : "",
                status:
                  typeof appointment.status === "string"
                    ? appointment.status
                    : "Pending",
                doctorName:
                  typeof appointment.doctorName === "string"
                    ? appointment.doctorName
                    : undefined,
                patientId: userDoc.id,
                patientName:
                  typeof userData.fullName === "string"
                    ? userData.fullName
                    : "Patient",
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
          avatarUrl: typeof docData.avatarUrl === "string" ? docData.avatarUrl : "",
          hospital: typeof docData.hospital === "string" ? docData.hospital : "Not specified",
          location: typeof docData.location === "string" ? docData.location : "Not specified",
          availableHours: typeof docData.availableHours === "string" ? docData.availableHours : "Not specified",
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

        const updatedAppointments = appointments.map((app: unknown) => {
          if (typeof app !== "object" || app === null) return app;
          const appointment = app as Record<string, unknown>;
          return appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment;
        },
        );

        await updateDoc(patientRef, { appointments: updatedAppointments });

        await fetchDoctorData();
      }
    } catch (err) {
      console.error("Failed to update appointment status:", err);
    }
  };

  const updateAvatar = async (avatarUrl: string) => {
    if (!docId) return;
    await updateDoc(doc(db, "medical-staff", docId), { avatarUrl });
    await fetchDoctorData();
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
    updateAvatar,
  };
};
