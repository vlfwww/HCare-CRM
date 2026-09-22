import React from "react";
import { PatientHeader } from "./PatientHeader";
import { EditProfileModal } from "../../edit-profile/ui/EditProfileModal";
import { usePatientProfile } from "../model/usePatientProfile";
import { usePatientTabs, type PatientTabType } from "../model/usePatientTabs";

import { SummaryTab } from "./tabs/SummaryTab";
import { CarePlanTab } from "./tabs/CarePlanTab";
import { LabResultsTab } from "./tabs/LabResultsTab";
import { PghdTab } from "./tabs/PghdTab";
import { PrescriptionsTab } from "./tabs/PrescriptionsTab";

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

  const { activeTab, setActiveTab } = usePatientTabs();

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

  const tabsConfig: { id: PatientTabType; label: string }[] = [
    { id: "summary", label: "Summary" },
    { id: "care-plan", label: "Care plan" },
    { id: "lab-results", label: "Lab results" },
    { id: "pghd", label: "PGHD" },
    { id: "prescriptions", label: "Prescriptions" },
  ];

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
          {tabsConfig.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 transition-colors cursor-pointer font-medium text-sm ${
                  isActive
                    ? "text-emerald-600 font-semibold border-b-2 border-emerald-500 -mb-[5px]"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "summary" && (
          <SummaryTab
            userId={userId}
            profileData={profileData}
            availableSurveys={availableSurveys}
            feedbacks={feedbacks}
            onEditProfile={handleOpenModal}
            onAppointmentCreated={(newApp) => {
              void addAppointmentToDb(
                newApp as unknown as Parameters<typeof addAppointmentToDb>[0],
              );
            }}
            onSurveyCreated={(newSurvey) => {
              void addSurveyToDb(newSurvey);
            }}
          />
        )}

        {activeTab === "care-plan" && <CarePlanTab />}
        {activeTab === "lab-results" && <LabResultsTab />}
        {activeTab === "pghd" && <PghdTab />}
        {activeTab === "prescriptions" && <PrescriptionsTab />}
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={profileData}
      />
    </div>
  );
};
