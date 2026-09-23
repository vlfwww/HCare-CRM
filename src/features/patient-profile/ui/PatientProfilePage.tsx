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
import { ChatTab } from "./tabs/ChatTab";

interface PatientProfilePageProps {
  targetUserId?: string;
}

export const PatientProfilePage: React.FC<PatientProfilePageProps> = ({
  targetUserId,
}) => {
  const { activeTab, setActiveTab } = usePatientTabs();
  const {
    userId,
    isLoading,
    error,
    isModalOpen,
    profileData,
    isProfileComplete,
    updateAvatar,
    availableSurveys,
    feedbacks,
    isDoctor,
    pghdData,
    prescriptions,
    handleOpenModal,
    handleCloseModal,
    addAppointmentToDb,
    addSurveyToDb,
    addCarePlanToDb,
    updateSurveyResultInDb,
    addPrescriptionToDb,
  } = usePatientProfile(targetUserId, activeTab);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500 font-medium">Failed to load data.</p>
      </div>
    );
  }

  const tabsConfig: { id: PatientTabType | "chat"; label: string }[] = [
    { id: "summary", label: "Summary" },
    { id: "care-plan", label: "Care plan" },
    { id: "lab-results", label: "Lab results" },
    { id: "pghd", label: "PGHD" },
    { id: "prescriptions", label: "Prescriptions" },
    { id: "chat", label: "Support Chat" },
  ];

  const canEditProfile = !isDoctor;

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-4 sm:py-6 font-manrope relative">
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-8 shadow-sm">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
          <PatientHeader
            fullName={profileData.fullName}
            role={profileData.role}
            avatarUrl={profileData.avatarUrl}
            canEdit={canEditProfile}
            onAvatarChange={(avatarUrl) => {
              void updateAvatar(avatarUrl);
            }}
          />

          {canEditProfile && (
            <button
              onClick={handleOpenModal}
              type="button"
              aria-label={isProfileComplete ? "Edit profile" : "Complete profile"}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              {isProfileComplete ? "Edit Profile" : "Complete Profile!"}
            </button>
          )}
        </div>

        <div
          className="flex flex-wrap gap-x-6 gap-y-2 border-b border-gray-100 mb-8 pb-1"
          role="tablist"
          aria-label="Patient profile sections"
        >
          {tabsConfig.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PatientTabType)}
                type="button"
                aria-label={`Open ${tab.label}`}
                aria-selected={isActive}
                role="tab"
                aria-controls={`patient-panel-${tab.id}`}
                className={`pb-3 transition-colors cursor-pointer font-medium text-sm ${
                  isActive
                    ? "text-emerald-600 font-semibold border-b-2 border-emerald-500 -mb-[5px]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "summary" && (
          <div id="patient-panel-summary" role="tabpanel" aria-label="Summary">
            <SummaryTab
              userId={userId}
              profileData={profileData}
              availableSurveys={availableSurveys}
              feedbacks={isDoctor ? [] : feedbacks}
              onEditProfile={canEditProfile ? handleOpenModal : undefined}
              onAppointmentCreated={async (newApp) => {
                await addAppointmentToDb(
                  newApp as unknown as Parameters<typeof addAppointmentToDb>[0],
                );
              }}
              onSurveyCreated={(newSurvey) => {
                void addSurveyToDb(newSurvey);
              }}
            />
          </div>
        )}

        {activeTab === "care-plan" && (
          <div id="patient-panel-care-plan" role="tabpanel" aria-label="Care plan">
            <CarePlanTab
            isDoctor={isDoctor}
            carePlans={profileData.carePlans || []}
            onAddCarePlan={(plan) => {
              void addCarePlanToDb(plan);
            }}
            />
          </div>
        )}

        {activeTab === "lab-results" && (
          <div id="patient-panel-lab-results" role="tabpanel" aria-label="Lab results">
            <LabResultsTab
            isDoctor={isDoctor}
            surveys={profileData.surveys}
            onUpdateSurveyResult={(surveyId, details, status) => {
              void updateSurveyResultInDb(surveyId, details, status);
            }}
            />
          </div>
        )}

        {activeTab === "pghd" && (
          <div id="patient-panel-pghd" role="tabpanel" aria-label="PGHD">
            <PghdTab userId={userId} pghdData={pghdData} />
          </div>
        )}

        {activeTab === "prescriptions" && (
          <div id="patient-panel-prescriptions" role="tabpanel" aria-label="Prescriptions">
            <PrescriptionsTab
            userId={userId}
            prescriptions={prescriptions}
            isDoctor={isDoctor}
            onAddPrescription={addPrescriptionToDb}
            />
          </div>
        )}

        {activeTab === ("chat" as PatientTabType) && (
          <div id="patient-panel-chat" role="tabpanel" aria-label="Support chat">
            <ChatTab />
          </div>
        )}
      </div>

      {canEditProfile && (
        <EditProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          initialData={profileData}
        />
      )}
    </div>
  );
};
