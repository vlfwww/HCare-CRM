import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/app/providers/firebase";
import { useQueryClient } from "@tanstack/react-query";

interface ContactData {
  phone: string;
  homePhone: string;
  address: string;
  email: string;
}

export const useContactEdit = (initialFullName: string, data: ContactData) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState(initialFullName || "");
  const [phone, setPhone] = useState(data?.phone || "");
  const [homePhone, setHomePhone] = useState(data?.homePhone || "");
  const [address, setAddress] = useState(data?.address || "");
  const [email, setEmail] = useState(data?.email || "");
  const [isSaving, setIsSaving] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
    homePhone?: string;
    address?: string;
    email?: string;
  }>({});

  useEffect(() => {
    setFullName(initialFullName || "");
    setPhone(data?.phone || "");
    setHomePhone(data?.homePhone || "");
    setAddress(data?.address || "");
    setEmail(data?.email || "");
  }, [initialFullName, data]);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";

    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[\d\s\-+()]+$/.test(phone) || !/\d/.test(phone)) {
      newErrors.phone = "Invalid phone format";
    }

    if (
      homePhone.trim() &&
      (!/^[\d\s\-+()]+$/.test(homePhone) || !/\d/.test(homePhone))
    ) {
      newErrors.homePhone = "Invalid phone format";
    }

    if (!address.trim()) newErrors.address = "Address is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setFullName(initialFullName || "");
    setPhone(data?.phone || "");
    setHomePhone(data?.homePhone || "");
    setAddress(data?.address || "");
    setEmail(data?.email || "");
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

      await updateDoc(docRef, {
        fullName,
        contactInfo: { phone, homePhone, address, email },
      });

      await queryClient.invalidateQueries({ queryKey: ["patient"] });
      setErrors({});
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update contact info:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isEditing,
    setIsEditing,
    isSaving,
    errors,
    setErrors,
    fields: { fullName, phone, homePhone, address, email },
    setters: { setFullName, setPhone, setHomePhone, setAddress, setEmail },
    handleCancel,
    handleSave,
  };
};
