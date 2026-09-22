import { useState, useEffect } from "react";
import { auth, db } from "@/app/providers/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useStaffQuery } from "./useStaffQuery";

export const useMedicalStaff = () => {
  const { data: staffList, isLoading, isError } = useStaffQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

  const userId = auth.currentUser?.uid || "";
  const [patientName, setPatientName] = useState("");
  const [patientDob, setPatientDob] = useState("");

  useEffect(() => {
    if (!userId) return;
    const fetchPatientInfo = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setPatientName(
            userData.fullName || auth.currentUser?.displayName || "Patient",
          );
          setPatientDob(userData.personalInfo?.birthDate || "");
        }
      } catch (err) {
        console.error("Error fetching user info for appointment:", err);
      }
    };
    fetchPatientInfo();
  }, [userId]);

  const handleOpenModalWithDoctor = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctorId("");
  };

  const handleAppointmentCreated = async (newAppointment: any) => {
    if (!userId) return;
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        appointments: arrayUnion(newAppointment),
      });
      console.log("Appointment successfully saved to database!");
    } catch (error) {
      console.error("Error saving appointment to database:", error);
    }
  };

  return {
    staffList,
    isLoading,
    isError,
    isModalOpen,
    selectedDoctorId,
    userId,
    patientName,
    patientDob,
    handleOpenModalWithDoctor,
    handleCloseModal,
    handleAppointmentCreated,
  };
};
