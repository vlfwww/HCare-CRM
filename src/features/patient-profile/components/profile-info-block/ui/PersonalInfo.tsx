import React, { useState, useEffect } from "react";
import { Edit2, Check, X } from "lucide-react";
import { ActionButton } from "../../../../../shared/ui/ActionButton";
import { MissingFieldBadge } from "./MissingFieldBadge";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/app/providers/firebase";
import { useQueryClient } from "@tanstack/react-query";

interface PersonalInfoProps {
  data: {
    gender: string;
    birthDate: string;
    age: number;
    patientId: string;
    nationality: string;
    maritalStatus: string;
    emergencyContact: string;
  };
  onEdit?: () => void;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({
  data: initialData,
}) => {
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6 relative">
      <div className="flex items-center justify-between mb-6">
        <p className="text-lg font-semibold text-gray-800">Personal</p>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center shadow-sm disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div onClick={() => setIsEditing(true)} className="cursor-pointer">
            <ActionButton icon={Edit2} />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-400 font-medium flex items-center justify-between">
            <span>Gender</span>
            {!isEditing && !initialData?.gender && (
              <MissingFieldBadge
                fieldName="Gender"
                onOpenModal={() => setIsEditing(true)}
              />
            )}
          </p>
          {isEditing ? (
            <>
              <select
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  if (errors.gender)
                    setErrors({ ...errors, gender: undefined });
                }}
                className={`w-full mt-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 bg-white ${
                  errors.gender
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-emerald-500"
                }`}
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </>
          ) : (
            <p className="text-sm font-semibold text-gray-800">
              {initialData?.gender || (
                <span className="text-red-500 text-xs">Missing data</span>
              )}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium flex items-center justify-between">
            <span>Birth Date</span>
            {!isEditing && !initialData?.birthDate && (
              <MissingFieldBadge
                fieldName="Birth Date"
                onOpenModal={() => setIsEditing(true)}
              />
            )}
          </p>
          {isEditing ? (
            <>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  if (errors.birthDate)
                    setErrors({ ...errors, birthDate: undefined });
                }}
                className={`w-full mt-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.birthDate
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-emerald-500"
                }`}
              />
              {errors.birthDate && (
                <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>
              )}
            </>
          ) : (
            <p className="text-sm font-semibold text-gray-800">
              {initialData?.birthDate ? (
                `${initialData.birthDate} (${initialData.age || 0})`
              ) : (
                <span className="text-red-500 text-xs">Missing data</span>
              )}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium">Nationality</p>
          {isEditing ? (
            <input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter nationality"
            />
          ) : (
            <p className="text-sm font-semibold text-gray-800">
              {initialData?.nationality || "-"}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium">Marital status</p>
          {isEditing ? (
            <select
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="" disabled>
                Select marital status
              </option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          ) : (
            <p className="text-sm font-semibold text-gray-800">
              {initialData?.maritalStatus || "-"}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium">Emergency contact</p>
          {isEditing ? (
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter emergency contact"
            />
          ) : (
            <p className="text-sm font-semibold text-gray-800">
              {initialData?.emergencyContact || "-"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
