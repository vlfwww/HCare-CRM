import React from "react";
import { useEditProfileModal } from "../model/useEditProfileModal";
import type { PatientProfileData } from "@/entities/patient/model/types";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: PatientProfileData;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { formData, errors, handleChange, handleSave, getInputClass } =
    useEditProfileModal(initialData, isOpen, onClose);

  if (!isOpen) return null;

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
