import React from "react";
import { PatientHeader } from "./PatientHeader";
import { ContactInfo } from "../../contact-info/ui/ContactInfo";
import { PersonalInfo } from "../../profile-info/ui/PersonalInfo";
import { Activities } from "../../activities/ui/Activities";
import { SurveysCard } from "../../surveys/ui/SurveysCard";
import { ContactPreferencesCard } from "../../contact-preferences/ui/ContactPreferencesCard";
import { EditProfileModal } from "../../edit-profile/ui/EditProfileModal";
import { InsuranceInfo } from "../../insurance-info/ui/InsuranceInfo";
import { AppointmentsCard } from "../../appointments/ui/AppointmentsCard";
import { FeedbackCard } from "@/features/feedback/ui/FeedbackCard";
import { usePatientProfile } from "../model/usePatientProfile";

export const PatientProfilePage: React.FC = () => {
  const {
    userId,
    data,
    isLoading,
    error,
    isModalOpen,
    profileData,
    availableSurveys,
    feedbacks,
    handleOpenModal,
    handleCloseModal,
    addAppointmentToDb,
    addSurveyToDb,
  } = usePatientProfile();

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
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            {data ? "Edit Profile" : "Complete Profile!"}
          </button>
        </div>

        <div className="flex gap-8 border-b border-gray-100 mb-8 pb-1">
          <button className="pb-3 text-emerald-600 font-semibold border-b-2 border-emerald-500 -mb-[5px] cursor-pointer">
            Summary
          </button>
          <button className="pb-3 text-gray-400 hover:text-gray-700 transition-colors font-medium cursor-pointer">
            Care plan
          </button>
          <button className="pb-3 text-gray-400 hover:text-gray-700 transition-colors font-medium cursor-pointer">
            Lab results
          </button>
          <button className="pb-3 text-gray-400 hover:text-gray-700 transition-colors font-medium cursor-pointer">
            PGHD
          </button>
          <button className="pb-3 text-gray-400 hover:text-gray-700 transition-colors font-medium cursor-pointer">
            Prescriptions
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <ContactInfo
              data={profileData.contactInfo}
              fullName={profileData.fullName}
            />
            <PersonalInfo data={profileData.personalInfo} />
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
            <SurveysCard
              userId={userId}
              surveys={profileData.surveys}
              availableSurveys={availableSurveys}
              onSurveyCreated={(newSurvey) => {
                void addSurveyToDb(newSurvey);
              }}
            />
            <FeedbackCard feedbacks={feedbacks} />
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
