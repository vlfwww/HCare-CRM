import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/app/providers/firebase";
import { useQueryClient } from "@tanstack/react-query";

interface PersonalData {
  gender: string;
  birthDate: string;
  age: number;
  patientId: string;
  nationality: string;
  maritalStatus: string;
  emergencyContact: string;
}

export const usePersonalInfo = (initialData: PersonalData) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) return dateStr;
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr.includes("/")) return dateStr;
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const [gender, setGender] = useState(initialData?.gender || "");
  const [birthDate, setBirthDate] = useState(
    formatDateForInput(initialData?.birthDate || ""),
  );
  const [nationality, setNationality] = useState(
    initialData?.nationality || "",
  );
  const [maritalStatus, setMaritalStatus] = useState(
    initialData?.maritalStatus || "",
  );
  const [emergencyContact, setEmergencyContact] = useState(
    initialData?.emergencyContact || "",
  );
  const [isSaving, setIsSaving] = useState(false);

  const [errors, setErrors] = useState<{
    gender?: string;
    birthDate?: string;
  }>({});

  useEffect(() => {
    setGender(initialData?.gender || "");
    setBirthDate(formatDateForInput(initialData?.birthDate || ""));
    setNationality(initialData?.nationality || "");
    setMaritalStatus(initialData?.maritalStatus || "");
    setEmergencyContact(initialData?.emergencyContact || "");
  }, [initialData]);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!gender.trim()) {
      newErrors.gender = "Gender is required";
    }

    if (!birthDate.trim()) {
      newErrors.birthDate = "Birth date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAge = (birthDateStr: string): number => {
    if (!birthDateStr) return 0;
    const parts = birthDateStr.split("-");
    if (parts.length !== 3) return 0;

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const birthDateObj = new Date(year, month, day);
    const today = new Date();

    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age >= 0 ? age : 0;
  };

  const handleCancel = () => {
    setGender(initialData?.gender || "");
    setBirthDate(formatDateForInput(initialData?.birthDate || ""));
    setNationality(initialData?.nationality || "");
    setMaritalStatus(initialData?.maritalStatus || "");
    setEmergencyContact(initialData?.emergencyContact || "");
    setErrors({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!validate()) return;

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      setIsSaving(true);
      const docRef = doc(db, "users", currentUser.uid);

      const computedAge = calculateAge(birthDate);
      const formattedBirthDate = formatDateForDisplay(birthDate);

      const updatedFields = {
        personalInfo: {
          ...initialData,
          gender,
          birthDate: formattedBirthDate,
          age: computedAge,
          nationality,
          maritalStatus,
          emergencyContact,
        },
      };

      await updateDoc(docRef, updatedFields);
      await queryClient.invalidateQueries({ queryKey: ["patient"] });

      setErrors({});
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenderChange = (value: string) => {
    setGender(value);
    if (errors.gender) setErrors((prev) => ({ ...prev, gender: undefined }));
  };

  const handleBirthDateChange = (value: string) => {
    setBirthDate(value);
    if (errors.birthDate)
      setErrors((prev) => ({ ...prev, birthDate: undefined }));
  };

  return {
    isEditing,
    setIsEditing,
    gender,
    birthDate,
    nationality,
    maritalStatus,
    emergencyContact,
    isSaving,
    errors,
    handleCancel,
    handleSave,
    handleGenderChange,
    handleBirthDateChange,
    setNationality,
    setMaritalStatus,
    setEmergencyContact,
  };
};
