import type { PatientProfileData } from "@/entities/patient/model/types";

export const isPatientProfileComplete = (profile: PatientProfileData): boolean =>
  [
    profile.fullName,
    profile.contactInfo?.email,
    profile.contactInfo?.phone,
    profile.contactInfo?.address,
    profile.personalInfo?.gender,
    profile.personalInfo?.birthDate,
    profile.personalInfo?.nationality,
    profile.personalInfo?.maritalStatus,
    profile.personalInfo?.emergencyContact,
    profile.insurance?.memberId,
    profile.insurance?.provider,
  ].every(
    (value) =>
      typeof value === "string" &&
      value.trim().length > 0 &&
      value.trim() !== "New Patient",
  );
