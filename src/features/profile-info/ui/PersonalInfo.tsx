import React from "react";
import { Edit2, Check, X } from "lucide-react";
import { ActionButton } from "../../../shared/ui/ActionButton";
import { MissingFieldBadge } from "../../../shared/ui/MissingFieldBadge";
import { usePersonalInfo } from "../model/usePersonalInfo";

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
  onEdit,
}) => {
  const {
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
  } = usePersonalInfo(initialData);

  const canEdit = Boolean(onEdit);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6 relative">
      <div className="flex items-center justify-between mb-6">
        <p className="text-lg font-semibold text-gray-800">Personal</p>

        {canEdit && (
          <div>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center shadow-sm disabled:opacity-50 cursor-pointer"
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditing(true)}
                className="cursor-pointer"
              >
                <ActionButton icon={Edit2} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-400 font-medium flex items-center justify-between">
            <span>Gender</span>
            {canEdit && !isEditing && !initialData?.gender && (
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
                onChange={(e) => handleGenderChange(e.target.value)}
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
            {canEdit && !isEditing && !initialData?.birthDate && (
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
                onChange={(e) => handleBirthDateChange(e.target.value)}
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
