import React, { useRef } from "react";
import { Camera, UserRound } from "lucide-react";

interface PatientHeaderProps {
  fullName: string;
  role: string;
  avatarUrl: string;
  canEdit?: boolean;
  onAvatarChange?: (avatarUrl: string) => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  fullName,
  role,
  avatarUrl,
  canEdit = false,
  onAvatarChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/") || file.size > 700 * 1024) {
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onAvatarChange?.(reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <div className="p-6 mb-6 flex items-center gap-4">
      <button
        type="button"
        className={`relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400 ${
          canEdit ? "cursor-pointer group" : "cursor-default"
        }`}
        onClick={() => canEdit && inputRef.current?.click()}
        disabled={!canEdit}
        title={canEdit ? "Change profile photo" : undefined}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={fullName || "Profile"} className="w-full h-full object-cover" />
        ) : (
          <UserRound className="w-8 h-8" />
        )}
        {canEdit && (
          <span className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/45 text-white">
            <Camera className="w-5 h-5" />
          </span>
        )}
      </button>
      {canEdit && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      )}
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          {fullName || "MISSING DATA"}
        </h2>
        <p className="text-sm text-gray-400">{role}</p>
      </div>
    </div>
  );
};
