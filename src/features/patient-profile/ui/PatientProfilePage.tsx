import React from "react";
import { usePatientData } from "../model/usePatientData";
import { PatientHeader } from "./PatientHeader";
import { ContactInfo } from "./ContactInfo";
import { PersonalInfo } from "./PersonalInfo";
import { Activities } from "./Activities";
import { InsuranceInfo } from "./InsuranceInfo";
import { AppointmentsCard } from "./AppointmentsCard";
import { SurveysCard } from "./SurveysCard";
import { FeedbackCard } from "./FeedbackCard";
import { ContactPreferencesCard } from "./ContactPreferencesCard";

export const PatientProfilePage: React.FC = () => {
  const { data, isLoading, error } = usePatientData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 font-medium">Loading patient profile...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500 font-medium">Failed to load patient data.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 font-manrope">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <PatientHeader
          fullName={data.fullName}
          role={data.role}
          avatarUrl={data.avatarUrl}
        />

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
            <ContactInfo data={data.contactInfo} />
            <PersonalInfo data={data.personalInfo} />
          </div>

          <div className="space-y-6">
            <Activities />
            <InsuranceInfo
              memberId={data.insurance.memberId}
              provider={data.insurance.provider}
            />
          </div>

          <div className="space-y-6">
            <AppointmentsCard appointments={data.appointments} />
            <SurveysCard />
            <FeedbackCard />
            <ContactPreferencesCard />
          </div>
        </div>
      </div>
    </div>
  );
};
