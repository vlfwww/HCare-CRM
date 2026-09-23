import React from "react";
import { ContactInfo } from "@/features/contact-info/ui/ContactInfo";
import { PersonalInfo } from "@/features/profile-info/ui/PersonalInfo";
import { Activities } from "@/features/activities/ui/Activities";
import { SurveysCard } from "@/features/surveys/ui/SurveysCard";
import { ContactPreferencesCard } from "@/features/contact-preferences/ui/ContactPreferencesCard";
import { InsuranceInfo } from "@/features/insurance-info/ui/InsuranceInfo";
import { AppointmentsCard } from "@/features/appointments/ui/AppointmentsCard";
import { FeedbackCard } from "@/features/feedback/ui/FeedbackCard";
import type { PatientProfileData } from "@/entities/patient/model/types";
import type { AppointmentItem, SurveyItem } from "../../model/types";
import type { FeedbackItem } from "@/features/feedback/model/types";

interface SummaryTabProps {
  userId: string;
  profileData: PatientProfileData & { surveys?: SurveyItem[] };
  availableSurveys: string[];
  feedbacks: FeedbackItem[];
  onEditProfile?: () => void;
  onAppointmentCreated: (newApp: AppointmentItem) => void;
  onSurveyCreated: (newSurvey: Omit<SurveyItem, "id">) => void;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({
  userId,
  profileData,
  availableSurveys,
  feedbacks,
  onEditProfile,
  onAppointmentCreated,
  onSurveyCreated,
}) => {
  const isDoctorView = feedbacks.length === 0 && !onEditProfile;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-6">
        <ContactInfo
          data={profileData.contactInfo}
          fullName={profileData.fullName}
          onEdit={onEditProfile}
        />
        <PersonalInfo
          data={profileData.personalInfo}
          onEdit={onEditProfile}
        />
      </div>

      <div className="space-y-6">
        <Activities userId={userId} />
        <InsuranceInfo
          memberId={profileData.insurance?.memberId || ""}
          provider={profileData.insurance?.provider || ""}
          onEdit={onEditProfile}
        />
      </div>

      <div className="space-y-6">
        <AppointmentsCard
          userId={userId}
          patientName={profileData.fullName}
          patientDob={profileData.personalInfo?.birthDate || ""}
          appointments={profileData.appointments}
          onAppointmentCreated={isDoctorView ? undefined : onAppointmentCreated}
        />
        <SurveysCard
          userId={userId}
          surveys={profileData.surveys || []}
          availableSurveys={availableSurveys}
          onSurveyCreated={isDoctorView ? undefined : onSurveyCreated}
        />
        {!isDoctorView && (
          <>
            <FeedbackCard feedbacks={feedbacks} />
            <ContactPreferencesCard />
          </>
        )}
      </div>
    </div>
  );
};
