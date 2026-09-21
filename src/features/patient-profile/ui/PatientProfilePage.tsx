import React, { useState, useEffect } from "react";
import { auth } from "@/app/providers/firebase";
import { PatientHeader } from "./PatientHeader";
import { ContactInfo } from "./ContactInfo";
import { PersonalInfo } from "./PersonalInfo";
import { Activities } from "./Activities";
import { InsuranceInfo } from "./InsuranceInfo";
import { AppointmentsCard } from "./AppointmentsCard";
import { SurveysCard } from "./SurveysCard";
import { FeedbackCard } from "./FeedbackCard";
import { ContactPreferencesCard } from "./ContactPreferencesCard";
import { EditProfileModal } from "./EditProfileModal";
import { usePatientData } from "@/entities/patient/model/usePatientData";
import { useAppointments } from "../model/useAppointments";
import type { AppointmentItem } from "../model/types";

const calculateAge = (birthDateStr: string): number => {
  if (!birthDateStr) return 0;
  const parts = birthDateStr.split("/");
  if (parts.length !== 3) return 0;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const birthDate = new Date(year, month, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() - birthDate.getDate() < 0)) {
    age--;
  }
  return age >= 0 ? age : 0;
};

export const PatientProfilePage: React.FC = () => {
  const { data, isLoading, error } = usePatientData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId = auth.currentUser?.uid || "";

  const initialAppointments: AppointmentItem[] = (data?.appointments ||
    []) as unknown as AppointmentItem[];

  const { appointments, addAppointmentToDb } = useAppointments(
    userId,
    initialAppointments,
  );

  useEffect(() => {
    if (data?.appointments) {
    }
  }, [data]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 font-medium">Loading patient profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500 font-medium">Failed to load patient data.</p>
      </div>
    );
  }

  const fullNameValue =
    data?.fullName || auth.currentUser?.displayName || "New Patient";

  const getInitialsSvg = (name: string) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="100%" height="100%" fill="%23059669"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="white" font-family="sans-serif" font-size="50" font-weight="bold">${initials}</text></svg>`;
  };

  const rawProfileData = data || {
    fullName: fullNameValue,
    role: "Patient",
    avatarUrl: getInitialsSvg(fullNameValue),
    contactInfo: { phone: "", homePhone: "", address: "", email: "" },
    personalInfo: {
      gender: "",
      birthDate: "",
      age: 0,
      patientId: "",
      nationality: "",
      maritalStatus: "",
      emergencyContact: "",
    },
    insurance: { memberId: "", provider: "" },
    activities: [],
  };

  const profileData = {
    ...rawProfileData,
    appointments,
    personalInfo: {
      ...rawProfileData.personalInfo,
      age: calculateAge(rawProfileData.personalInfo?.birthDate),
    },
  };

  if (profileData && !profileData.avatarUrl) {
    profileData.avatarUrl = getInitialsSvg(profileData.fullName || "User");
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 font-manrope relative">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <PatientHeader
            fullName={profileData.fullName}
            role={profileData.role}
            avatarUrl={profileData.avatarUrl}
          />
          <button
            onClick={handleOpenModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            {data ? "Edit Profile" : "Complete Profile!"}
          </button>
        </div>

        <div className="flex gap-8 border-b border-gray-100 mb-8 pb-1">
          <button className="pb-3 text-emerald-600 font-semibold border-b-2 border-emerald-500 -mb-[5px]">
            Summary
          </button>
          <button className="pb-3 text-gray-400 hover:text-gray-700 transition-colors font-medium">
            Care plan
          </button>
          <button className="pb-3 text-gray-400 hover:text-gray-700 transition-colors font-medium">
            Lab results
          </button>
          <button className="pb-3 text-gray-400 hover:text-gray-700 transition-colors font-medium">
            PGHD
          </button>
          <button className="pb-3 text-gray-400 hover:text-gray-700 transition-colors font-medium">
            Prescriptions
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <ContactInfo
              data={profileData.contactInfo}
              fullName={profileData.fullName}
              onEdit={handleOpenModal}
            />
            <PersonalInfo
              data={profileData.personalInfo}
              onEdit={handleOpenModal}
            />
          </div>

          <div className="space-y-6">
            <Activities userId={userId} />
            <InsuranceInfo
              memberId={profileData.insurance?.memberId || ""}
              provider={profileData.insurance?.provider || ""}
              onEdit={handleOpenModal}
            />
          </div>

          <div className="space-y-6">
            <AppointmentsCard
              userId={userId}
              patientName={profileData.fullName}
              patientDob={profileData.personalInfo?.birthDate || ""}
              appointments={profileData.appointments}
              onAppointmentCreated={(newApp) => {
                void addAppointmentToDb(
                  newApp as unknown as Parameters<typeof addAppointmentToDb>[0],
                );
              }}
            />
            <SurveysCard />
            <FeedbackCard />
            <ContactPreferencesCard />
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={profileData}
      />
    </div>
  );
};
