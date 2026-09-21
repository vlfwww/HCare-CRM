import React, { useState, useEffect } from "react";
import { Edit2, Check, X } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/app/providers/firebase";
import { useQueryClient } from "@tanstack/react-query";
import { ActionButton } from "@/shared/ui/ActionButton";
import { MissingFieldBadge } from "./MissingFieldBadge";

interface InsuranceInfoProps {
  memberId: string;
  provider: string;
  onEdit?: () => void;
}

export const InsuranceInfo: React.FC<InsuranceInfoProps> = ({
  memberId: initialMemberId,
  provider: initialProvider,
}) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const [memberId, setMemberId] = useState(initialMemberId || "");
  const [provider, setProvider] = useState(initialProvider || "");
  const [isSaving, setIsSaving] = useState(false);

  const [errors, setErrors] = useState<{
    memberId?: string;
    provider?: string;
  }>({});

  useEffect(() => {
    setMemberId(initialMemberId || "");
    setProvider(initialProvider || "");
  }, [initialMemberId, initialProvider]);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!memberId.trim()) {
      newErrors.memberId = "Member ID is required";
    }

    if (!provider.trim()) {
      newErrors.provider = "Insurance Provider is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setMemberId(initialMemberId || "");
    setProvider(initialProvider || "");
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

      const updatedFields = {
        insurance: {
          memberId,
          provider,
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
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6 font-manrope relative">
      <div className="flex items-center justify-between mb-6">
        <p className="text-lg font-semibold text-gray-800">Insurance Info</p>

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
            <span>Member ID</span>
            {!isEditing && !initialMemberId && (
              <MissingFieldBadge
                fieldName="Insurance Member ID"
                onOpenModal={() => setIsEditing(true)}
              />
            )}
          </p>
          {isEditing ? (
            <>
              <input
                type="text"
                value={memberId}
                onChange={(e) => {
                  setMemberId(e.target.value);
                  if (errors.memberId)
                    setErrors({ ...errors, memberId: undefined });
                }}
                className={`w-full mt-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.memberId
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-emerald-500"
                }`}
                placeholder="Enter member ID"
              />
              {errors.memberId && (
                <p className="text-red-500 text-xs mt-1">{errors.memberId}</p>
              )}
            </>
          ) : (
            <p className="text-sm font-semibold text-gray-800">
              {initialMemberId || (
                <span className="text-red-500 text-xs">Missing data</span>
              )}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium flex items-center justify-between">
            <span>Insurance Provider</span>
            {!isEditing && !initialProvider && (
              <MissingFieldBadge
                fieldName="Insurance Provider"
                onOpenModal={() => setIsEditing(true)}
              />
            )}
          </p>
          {isEditing ? (
            <>
              <input
                type="text"
                value={provider}
                onChange={(e) => {
                  setProvider(e.target.value);
                  if (errors.provider)
                    setErrors({ ...errors, provider: undefined });
                }}
                className={`w-full mt-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.provider
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-emerald-500"
                }`}
                placeholder="Enter provider name"
              />
              {errors.provider && (
                <p className="text-red-500 text-xs mt-1">{errors.provider}</p>
              )}
            </>
          ) : (
            <p className="text-sm font-semibold text-gray-800">
              {initialProvider || (
                <span className="text-red-500 text-xs">Missing data</span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
