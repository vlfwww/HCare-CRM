import { useState } from "react";

export type PatientTabType =
  | "summary"
  | "care-plan"
  | "lab-results"
  | "pghd"
  | "prescriptions";

export const usePatientTabs = () => {
  const [activeTab, setActiveTab] = useState<PatientTabType>("summary");

  return {
    activeTab,
    setActiveTab,
  };
};
