import React from "react";
import { MissingFieldBadge } from "./MissingFieldBadge";

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
  onEdit: () => void;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ data, onEdit }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6">
      <p className="text-lg font-semibold text-gray-800 mb-6">Personal</p>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-400 font-medium flex items-center">
            Gender{" "}
            {!data?.gender && (
              <MissingFieldBadge fieldName="Gender" onOpenModal={onEdit} />
            )}
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {data?.gender || (
              <span className="text-red-500 text-xs">Missing data</span>
            )}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium flex items-center">
            Birth Date{" "}
            {!data?.birthDate && (
              <MissingFieldBadge fieldName="Birth Date" onOpenModal={onEdit} />
            )}
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {data?.birthDate ? (
              `${data.birthDate} (${data.age || 0})`
            ) : (
              <span className="text-red-500 text-xs">Missing data</span>
            )}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium">Patient ID</p>
          <p className="text-sm font-semibold text-gray-800">
            {data?.patientId || "Auto-generated"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium">Nationality</p>
          <p className="text-sm font-semibold text-gray-800">
            {data?.nationality || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium">Marital status</p>
          <p className="text-sm font-semibold text-gray-800">
            {data?.maritalStatus || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium">Emergency contact</p>
          <p className="text-sm font-semibold text-gray-800">
            {data?.emergencyContact || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};
