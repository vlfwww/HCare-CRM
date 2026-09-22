import React from "react";
import { ContactInfo } from "@/features/contact-info/ui/ContactInfo";
import { PersonalInfo } from "@/features/profile-info/ui/PersonalInfo";
import { Activities } from "@/features/activities/ui/Activities";
import { SurveysCard } from "@/features/surveys/ui/SurveysCard";
import { ContactPreferencesCard } from "@/features/contact-preferences/ui/ContactPreferencesCard";
import { InsuranceInfo } from "@/features/insurance-info/ui/InsuranceInfo";
import { AppointmentsCard } from "@/features/appointments/ui/AppointmentsCard";
import { FeedbackCard } from "@/features/feedback/ui/FeedbackCard";

interface SummaryTabProps {
  userId: string;
  profileData: any;
  availableSurveys: any[];
  feedbacks: any[];
  onEditProfile: () => void;
  onAppointmentCreated: (newApp: any) => void;
  onSurveyCreated: (newSurvey: any) => void;
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
  return (
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
          onEdit={onEditProfile}
        />
      </div>

      <div className="space-y-6">
        <AppointmentsCard
          userId={userId}
          patientName={profileData.fullName}
          patientDob={profileData.personalInfo?.birthDate || ""}
          appointments={profileData.appointments}
          onAppointmentCreated={onAppointmentCreated}
        />
        <SurveysCard
          userId={userId}
          surveys={profileData.surveys}
          availableSurveys={availableSurveys}
          onSurveyCreated={onSurveyCreated}
        />
        <FeedbackCard feedbacks={feedbacks} />
        <ContactPreferencesCard />
      </div>
    </div>
  );
};
