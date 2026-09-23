import React from "react";
import { Edit2, Check, X } from "lucide-react";
import { ActionButton } from "../../../shared/ui/ActionButton";
import { useContactEdit } from "../model/useContactEdit";
import { ContactFieldItem } from "./ContactFieldItem";

interface ContactInfoProps {
  fullName: string;
  data: {
    phone: string;
    homePhone: string;
    address: string;
    email: string;
  };
  onEdit?: () => void;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
  fullName: initialFullName,
  data,
  onEdit,
}) => {
  const {
    isEditing,
    setIsEditing,
    isSaving,
    errors,
    setErrors,
    fields,
    setters,
    handleCancel,
    handleSave,
  } = useContactEdit(initialFullName, data);

  const canEdit = Boolean(onEdit);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative font-manrope">
      <div className="flex items-center justify-between mb-6">
        <p className="text-lg font-semibold text-gray-800">Contact info</p>

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
                <ActionButton icon={Edit2} ariaLabel="Edit contact information" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <ContactFieldItem
          label="Full Name"
          value={fields.fullName}
          isEditing={isEditing}
          error={errors.fullName}
          isEmpty={
            canEdit &&
            (!fields.fullName.trim() || fields.fullName === "New Patient")
          }
          onChange={(val) => {
            setters.setFullName(val);
            if (errors.fullName) setErrors({ ...errors, fullName: undefined });
          }}
          onOpenModal={() => canEdit && setIsEditing(true)}
          renderDisplayValue={() => fields.fullName.trim() || "MISSING DATA"}
        />

        <ContactFieldItem
          label="Phone"
          value={fields.phone}
          isEditing={isEditing}
          error={errors.phone}
          placeholder="+1 (555) 000-0000"
          isEmpty={canEdit && !fields.phone?.trim()}
          onChange={(val) => {
            setters.setPhone(val);
            if (errors.phone) setErrors({ ...errors, phone: undefined });
          }}
          onOpenModal={() => canEdit && setIsEditing(true)}
        />

        <ContactFieldItem
          label="Home Phone"
          value={fields.homePhone}
          isEditing={isEditing}
          error={errors.homePhone}
          placeholder="+1 (555) 000-0000"
          isEmpty={false}
          onChange={(val) => {
            setters.setHomePhone(val);
            if (errors.homePhone)
              setErrors({ ...errors, homePhone: undefined });
          }}
          onOpenModal={() => canEdit && setIsEditing(true)}
          renderDisplayValue={() => data?.homePhone || "-"}
        />

        <ContactFieldItem
          label="Address"
          value={fields.address}
          isEditing={isEditing}
          error={errors.address}
          placeholder="Enter address"
          isEmpty={canEdit && !fields.address?.trim()}
          onChange={(val) => {
            setters.setAddress(val);
            if (errors.address) setErrors({ ...errors, address: undefined });
          }}
          onOpenModal={() => canEdit && setIsEditing(true)}
        />

        <ContactFieldItem
          label="Email"
          type="email"
          value={fields.email}
          isEditing={isEditing}
          error={errors.email}
          placeholder="example@domain.com"
          isEmpty={canEdit && !fields.email?.trim()}
          onChange={(val) => {
            setters.setEmail(val);
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          onOpenModal={() => canEdit && setIsEditing(true)}
          renderDisplayValue={() =>
            data?.email ? (
              <a
                href={`mailto:${data.email}`}
                className="text-emerald-600 hover:underline inline-block"
              >
                {data.email}
              </a>
            ) : undefined
          }
        />
      </div>
    </div>
  );
};
