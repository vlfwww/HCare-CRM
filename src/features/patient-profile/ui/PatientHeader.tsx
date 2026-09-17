import React from "react";

interface PatientHeaderProps {
  fullName: string;
  role: string;
  avatarUrl: string;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  fullName,
  role,
  avatarUrl,
}) => {
  return (
    <div className="p-6 mb-6 flex items-center gap-4">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
        <img
          src={avatarUrl}
          alt={fullName}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800">{fullName}</h2>
        <p className="text-sm text-gray-400">{role}</p>
      </div>
    </div>
  );
};
