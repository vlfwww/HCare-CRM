import { MissingFieldBadge } from "@/shared/ui/MissingFieldBadge";
import React from "react";

interface ContactFieldItemProps {
  label: string;
  value: string;
  isEditing: boolean;
  error?: string;
  placeholder?: string;
  type?: string;
  isEmpty: boolean;
  isRequired?: boolean;
  onChange: (val: string) => void;
  onOpenModal: () => void;
  renderDisplayValue?: () => React.ReactNode;
}

export const ContactFieldItem: React.FC<ContactFieldItemProps> = ({
  label,
  value,
  isEditing,
  error,
  placeholder,
  type = "text",
  isEmpty,
  onChange,
  onOpenModal,
  renderDisplayValue,
}) => {
  return (
    <div>
      <p className="text-xs text-gray-400 font-medium flex items-center justify-between">
        <span>{label}</span>
        {!isEditing && isEmpty && (
          <MissingFieldBadge fieldName={label} onOpenModal={onOpenModal} />
        )}
      </p>

      {isEditing ? (
        <>
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full mt-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              error
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-emerald-500"
            }`}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </>
      ) : (
        <div className="text-sm font-semibold text-gray-800 mt-0.5">
          {renderDisplayValue ? (
            renderDisplayValue()
          ) : isEmpty ? (
            <span className="text-red-500 text-xs font-normal">
              Missing data
            </span>
          ) : (
            value || "-"
          )}
        </div>
      )}
    </div>
  );
};
