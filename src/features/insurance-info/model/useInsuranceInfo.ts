import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/app/providers/firebase";
import { useQueryClient } from "@tanstack/react-query";

export const useInsuranceInfo = (
  initialMemberId: string,
  initialProvider: string,
) => {
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

  const handleMemberIdChange = (value: string) => {
    setMemberId(value);
    if (errors.memberId) {
      setErrors((prev) => ({ ...prev, memberId: undefined }));
    }
  };

  const handleProviderChange = (value: string) => {
    setProvider(value);
    if (errors.provider) {
      setErrors((prev) => ({ ...prev, provider: undefined }));
    }
  };

  return {
    isEditing,
    setIsEditing,
    memberId,
    provider,
    isSaving,
    errors,
    handleCancel,
    handleSave,
    handleMemberIdChange,
    handleProviderChange,
  };
};
