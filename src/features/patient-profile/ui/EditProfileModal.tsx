import React, { useState, useEffect } from "react";
import { auth, db } from "@/app/providers/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: any;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) return dateStr;
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr.includes("/")) return dateStr;
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  useEffect(() => {
    if (isOpen && initialData) {
      const formattedData = {
        ...initialData,
        personalInfo: {
          ...initialData.personalInfo,
          birthDate: formatDataForModalInit(
            initialData.personalInfo?.birthDate,
          ),
        },
      };
      setFormData(formattedData);
      setErrors({});
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialData]);

  const formatDataForModalInit = (dateStr: string) => {
    return formatDateForInput(dateStr);
  };

  if (!isOpen) return null;

  const handleChange = (
    section: string | null,
    field: string,
    value: string,
  ) => {
    if (section) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const fullName = formData.fullName;
    const email = formData.contactInfo?.email;
    const phone = formData.contactInfo?.phone;
    const homePhone = formData.contactInfo?.homePhone;
    const address = formData.contactInfo?.address;
    const gender = formData.personalInfo?.gender;
    const birthDate = formData.personalInfo?.birthDate;
    const nationality = formData.personalInfo?.nationality;
    const maritalStatus = formData.personalInfo?.maritalStatus;
    const emergencyContact = formData.personalInfo?.emergencyContact;
    const memberId = formData.insurance?.memberId;
    const provider = formData.insurance?.provider;

    if (!fullName?.trim()) newErrors.fullName = "Field is required";

    if (!email?.trim()) newErrors.email = "Field is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";

    if (!phone?.trim()) newErrors.phone = "Field is required";
    else if (!/^[0-9+\s()-]+$/.test(phone))
      newErrors.phone = "Invalid phone format";

    if (homePhone?.trim() && !/^[0-9+\s()-]+$/.test(homePhone)) {
      newErrors.homePhone = "Invalid phone format";
    }

    if (!address?.trim()) newErrors.address = "Field is required";
    if (!gender?.trim()) newErrors.gender = "Field is required";

    if (!birthDate?.trim()) {
      newErrors.birthDate = "Field is required";
    } else {
      const inputDate = new Date(birthDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(inputDate.getTime())) {
        newErrors.birthDate = "Invalid date format";
      } else if (inputDate > today) {
        newErrors.birthDate = "Birth date cannot be in the future";
      }
    }

    if (!nationality?.trim()) newErrors.nationality = "Field is required";
    if (!maritalStatus?.trim()) newErrors.maritalStatus = "Field is required";
    if (!emergencyContact?.trim())
      newErrors.emergencyContact = "Field is required";
    if (!memberId?.trim()) newErrors.memberId = "Field is required";
    if (!provider?.trim()) newErrors.provider = "Field is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const dataToSave = {
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          birthDate: formatDateForDisplay(formData.personalInfo?.birthDate),
        },
      };

      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, dataToSave, { merge: false });
      queryClient.invalidateQueries({ queryKey: ["patient", currentUser.uid] });
      onClose();
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const getInputClass = (fieldName: string) =>
    `w-full border rounded-lg p-2 focus:outline-none ${
      errors[fieldName]
        ? "border-red-500 bg-red-50/20"
        : "border-gray-200 focus:border-emerald-500"
    }`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto font-manrope">
        <p className="text-lg font-bold text-gray-800 mb-4">
          Edit Patient Profile
        </p>
        <form onSubmit={handleSave} className="space-y-4 text-sm" noValidate>
          <div>
            <label className="block text-xs text-gray-500 font-medium mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName || ""}
              onChange={(e) => handleChange(null, "fullName", e.target.value)}
              className={getInputClass("fullName")}
            />
            {errors.fullName && (
              <span className="text-red-500 text-[10px] block mt-0.5">
                {errors.fullName}
              </span>
            )}
          </div>

          <div className="border-t pt-3">
            <p className="font-semibold text-gray-700 mb-2">Contact Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Phone *
                </label>
                <input
                  type="text"
                  placeholder="+1 (234) 567-8900"
                  value={formData.contactInfo?.phone || ""}
                  onChange={(e) =>
                    handleChange("contactInfo", "phone", e.target.value)
                  }
                  className={getInputClass("phone")}
                />
                {errors.phone && (
                  <span className="text-red-500 text-[10px] block mt-0.5">
                    {errors.phone}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Home Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+1 (234) 567-8900"
                  value={formData.contactInfo?.homePhone || ""}
                  onChange={(e) =>
                    handleChange("contactInfo", "homePhone", e.target.value)
                  }
                  className={getInputClass("homePhone")}
                />
                {errors.homePhone && (
                  <span className="text-red-500 text-[10px] block mt-0.5">
                    {errors.homePhone}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Email *
                </label>
                <input
                  type="text"
                  placeholder="example@email.com"
                  value={formData.contactInfo?.email || ""}
                  onChange={(e) =>
                    handleChange("contactInfo", "email", e.target.value)
                  }
                  className={getInputClass("email")}
                />
                {errors.email && (
                  <span className="text-red-500 text-[10px] block mt-0.5">
                    {errors.email}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  placeholder="123 Main Street, City"
                  value={formData.contactInfo?.address || ""}
                  onChange={(e) =>
                    handleChange("contactInfo", "address", e.target.value)
                  }
                  className={getInputClass("address")}
                />
                {errors.address && (
                  <span className="text-red-500 text-[10px] block mt-0.5">
                    {errors.address}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-3">
            <p className="font-semibold text-gray-700 mb-2">Personal Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.personalInfo?.gender || ""}
                  onChange={(e) =>
                    handleChange("personalInfo", "gender", e.target.value)
                  }
                  className={`bg-white ${getInputClass("gender")}`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <span className="text-red-500 text-[10px] block mt-0.5">
                    {errors.gender}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Birth Date *
                </label>
                <input
                  type="date"
                  value={formData.personalInfo?.birthDate || ""}
                  onChange={(e) =>
                    handleChange("personalInfo", "birthDate", e.target.value)
                  }
                  className={getInputClass("birthDate")}
                />
                {errors.birthDate && (
                  <span className="text-red-500 text-[10px] block mt-0.5">
                    {errors.birthDate}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Nationality *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo?.nationality || ""}
                  onChange={(e) =>
                    handleChange("personalInfo", "nationality", e.target.value)
                  }
                  className={getInputClass("nationality")}
                />
                {errors.nationality && (
                  <span className="text-red-500 text-[10px] block mt-0.5">
                    {errors.nationality}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Marital status *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo?.maritalStatus || ""}
                  onChange={(e) =>
                    handleChange(
                      "personalInfo",
                      "maritalStatus",
                      e.target.value,
                    )
                  }
                  className={getInputClass("maritalStatus")}
                />
                {errors.maritalStatus && (
                  <span className="text-red-500 text-[10px] block mt-0.5">
                    {errors.maritalStatus}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Emergency contact *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo?.emergencyContact || ""}
                  onChange={(e) =>
                    handleChange(
                      "personalInfo",
                      "emergencyContact",
                      e.target.value,
                    )
                  }
                  className={getInputClass("emergencyContact")}
                />
                {errors.emergencyContact && (
                  <span className="text-red-500 text-[10px] block mt-0.5">
                    {errors.emergencyContact}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-3">
            <p className="font-semibold text-gray-700 mb-2">Insurance Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Member ID *
                </label>
                <input
                  type="text"
                  value={formData.insurance?.memberId || ""}
                  onChange={(e) =>
                    handleChange("insurance", "memberId", e.target.value)
                  }
                  className={getInputClass("memberId")}
                />
                {errors.memberId && (
                  <span className="text-red-500 text-[10px] block mt-0.5">
                    {errors.memberId}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Provider *
                </label>
                <input
                  type="text"
                  value={formData.insurance?.provider || ""}
                  onChange={(e) =>
                    handleChange("insurance", "provider", e.target.value)
                  }
                  className={getInputClass("provider")}
                />
                {errors.provider && (
                  <span className="text-red-500 text-[10px] block mt-0.5">
                    {errors.provider}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
