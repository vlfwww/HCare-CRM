import React, { useState, useEffect } from "react";
import { Edit2, Check, X } from "lucide-react";
import { ActionButton } from "../../../../../shared/ui/ActionButton";
import { MissingFieldBadge } from "./MissingFieldBadge";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/app/providers/firebase";
import { useQueryClient } from "@tanstack/react-query";

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
}) => {
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

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
      newErrors.phone = "Invalid phone format";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

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

      const updatedFields = {
        fullName,
        contactInfo: {
          phone,
          homePhone,
          address,
          email,
        },
      };

      await updateDoc(docRef, updatedFields);
      await queryClient.invalidateQueries({ queryKey: ["patient"] });

      setErrors({});
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update contact info:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative font-manrope">
      <div className="flex items-center justify-between mb-6">
        <p className="text-lg font-semibold text-gray-800">Contact info</p>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center shadow-sm disabled:opacity-50"
              title="Save"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors flex items-center justify-center"
              title="Cancel"
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
          <p className="text-xs text-gray-400 font-medium">Full Name</p>
          {isEditing ? (
            <>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName)
                    setErrors({ ...errors, fullName: undefined });
                }}
                className={`w-full mt-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-emerald-500"
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </>
          ) : (
            <p className="text-sm font-semibold text-gray-800">
              {initialFullName || "Not specified"}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium flex items-center justify-between">
            <span>Phone</span>
            {!isEditing && !data?.phone && (
              <MissingFieldBadge
                fieldName="Phone"
                onOpenModal={() => setIsEditing(true)}
              />
            )}
          </p>
          {isEditing ? (
            <>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                className={`w-full mt-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-emerald-500"
                }`}
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </>
          ) : (
            <p className="text-sm font-semibold text-gray-800">
              {data?.phone || (
                <span className="text-red-500 text-xs font-normal">
                  Missing data
                </span>
              )}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium">Home Phone</p>
          {isEditing ? (
            <input
              type="text"
              value={homePhone}
              onChange={(e) => setHomePhone(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="+1 (555) 000-0000"
            />
          ) : (
            <p className="text-sm font-semibold text-gray-800">
              {data?.homePhone || "-"}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium flex items-center justify-between">
            <span>Address</span>
            {!isEditing && !data?.address && (
              <MissingFieldBadge
                fieldName="Address"
                onOpenModal={() => setIsEditing(true)}
              />
            )}
          </p>
          {isEditing ? (
            <>
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address)
                    setErrors({ ...errors, address: undefined });
                }}
                className={`w-full mt-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.address
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-emerald-500"
                }`}
                placeholder="Enter address"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </>
          ) : (
            <p className="text-sm font-semibold text-gray-800">
              {data?.address || (
                <span className="text-red-500 text-xs font-normal">
                  Missing data
                </span>
              )}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium flex items-center justify-between">
            <span>Email</span>
            {!isEditing && !data?.email && (
              <MissingFieldBadge
                fieldName="Email"
                onOpenModal={() => setIsEditing(true)}
              />
            )}
          </p>
          {isEditing ? (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`w-full mt-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-emerald-500"
                }`}
                placeholder="example@domain.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </>
          ) : data?.email ? (
            <a
              href={`mailto:${data.email}`}
              className="text-sm font-semibold text-emerald-600 hover:underline inline-block"
            >
              {data.email}
            </a>
          ) : (
            <span className="text-red-500 text-xs font-normal">
              Missing data
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
