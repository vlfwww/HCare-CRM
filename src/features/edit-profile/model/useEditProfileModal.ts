import { useState, useEffect } from "react";
import { auth, db } from "@/app/providers/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import type { PatientProfileData } from "@/entities/patient/model/types";

export const useEditProfileModal = (
  initialData: PatientProfileData,
  isOpen: boolean,
  onClose: () => void,
) => {
  const [formData, setFormData] = useState<
    PatientProfileData & Record<string, unknown>
  >(initialData as PatientProfileData & Record<string, unknown>);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

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

  useEffect(() => {
    if (isOpen && initialData) {
      const formattedData = {
        ...initialData,
        personalInfo: {
          ...initialData.personalInfo,
          birthDate: formatDateForInput(initialData.personalInfo?.birthDate),
        },
      };
      setFormData(formattedData);
      setErrors({});
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialData]);

  const handleChange = (
    section: string | null,
    field: string,
    value: string,
  ) => {
    if (section) {
      setFormData({
        ...formData,
        [section]: {
          ...(typeof formData[section] === "object" &&
          formData[section] !== null
            ? formData[section]
            : {}),
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const fullName = formData.fullName;
    const email = formData.contactInfo?.email;
    const phone = formData.contactInfo?.phone;
    const homePhone = formData.contactInfo?.homePhone;
    const address = formData.contactInfo?.address;
    const gender = formData.personalInfo?.gender;
    const birthDate = formData.personalInfo?.birthDate;
    const nationality = formData.personalInfo?.nationality;
    const maritalStatus = formData.personalInfo?.maritalStatus;
    const emergencyContact = formData.personalInfo?.emergencyContact;
    const memberId = formData.insurance?.memberId;
    const provider = formData.insurance?.provider;

    if (!fullName?.trim()) newErrors.fullName = "Field is required";

    if (!email?.trim()) newErrors.email = "Field is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";

    if (!phone?.trim()) newErrors.phone = "Field is required";
    else if (!/^[0-9+\s()-]+$/.test(phone) || !/\d/.test(phone))
      newErrors.phone = "Invalid phone format";

    if (
      homePhone?.trim() &&
      (!/^[0-9+\s()-]+$/.test(homePhone) || !/\d/.test(homePhone))
    ) {
      newErrors.homePhone = "Invalid phone format";
    }

    if (!address?.trim()) newErrors.address = "Field is required";
    if (!gender?.trim()) newErrors.gender = "Field is required";

    if (!birthDate?.trim()) {
      newErrors.birthDate = "Field is required";
    } else {
      const inputDate = new Date(birthDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(inputDate.getTime())) {
        newErrors.birthDate = "Invalid date format";
      } else if (inputDate > today) {
        newErrors.birthDate = "Birth date cannot be in the future";
      }
    }

    if (!nationality?.trim()) newErrors.nationality = "Field is required";
    if (!maritalStatus?.trim()) newErrors.maritalStatus = "Field is required";
    if (!emergencyContact?.trim())
      newErrors.emergencyContact = "Field is required";
    if (!memberId?.trim()) newErrors.memberId = "Field is required";
    if (!provider?.trim()) newErrors.provider = "Field is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const dataToSave = {
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          birthDate: formatDateForDisplay(formData.personalInfo?.birthDate),
        },
      };

      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, dataToSave, { merge: false });
      queryClient.invalidateQueries({ queryKey: ["patient", currentUser.uid] });
      onClose();
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const getInputClass = (fieldName: string) =>
    `w-full border rounded-lg p-2 focus:outline-none ${
      errors[fieldName]
        ? "border-red-500 bg-red-50/20"
        : "border-gray-200 focus:border-emerald-500"
    }`;

  return {
    formData,
    errors,
    handleChange,
    handleSave,
    getInputClass,
  };
};
