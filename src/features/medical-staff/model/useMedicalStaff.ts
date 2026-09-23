import { useState, useEffect, useMemo } from "react";
import { auth, db } from "@/app/providers/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useStaffQuery } from "./useStaffQuery";
import type { AppointmentItem } from "@/features/patient-profile/model/types";
import { addUserNotification } from "@/shared/lib/notifications";

export const useMedicalStaff = () => {
  const { data: staffList, isLoading, isError } = useStaffQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

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

  const filteredStaffList = useMemo(() => {
    if (!staffList) return [];
    return staffList.filter((person) => {
      const matchesRole = selectedRole ? person.role === selectedRole : true;
      const matchesCity = selectedCity
        ? person.location?.includes(selectedCity) ||
          person.hospital?.includes(selectedCity)
        : true;
      return matchesRole && matchesCity;
    });
  }, [staffList, selectedRole, selectedCity]);

  const availableRoles = useMemo(() => {
    if (!staffList) return [];
    return Array.from(new Set(staffList.map((p) => p.role).filter(Boolean)));
  }, [staffList]);

  const handleOpenModalWithDoctor = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctorId("");
  };

  const handleAppointmentCreated = async (newAppointment: AppointmentItem) => {
    if (!userId) return;
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        appointments: arrayUnion(newAppointment),
      });
      await addUserNotification(userId, {
        title: "Appointment booked",
        message: `${newAppointment.doctorName || "Doctor"} · ${newAppointment.startTime || "Scheduled time"}`,
        type: "success",
      });
      await addUserNotification(selectedDoctorId, {
        title: "New appointment request",
        message: `${newAppointment.patientName || "Patient"} · ${newAppointment.startTime || "Scheduled time"}`,
        type: "info",
      });
      console.log("Appointment successfully saved to database!");
    } catch (error) {
      console.error("Error saving appointment to database:", error);
      throw error;
    }
  };

  const handleResetFilters = () => {
    setSelectedRole("");
    setSelectedCity("");
  };

  return {
    staffList: filteredStaffList,
    isLoading,
    isError,
    isModalOpen,
    selectedDoctorId,
    userId,
    patientName,
    patientDob,
    isFilterModalOpen,
    setIsFilterModalOpen,
    selectedRole,
    setSelectedRole,
    selectedCity,
    setSelectedCity,
    availableRoles,
    handleOpenModalWithDoctor,
    handleCloseModal,
    handleAppointmentCreated,
    handleResetFilters,
  };
};
